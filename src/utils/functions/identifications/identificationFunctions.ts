import {
  IdentificationConfiguration,
  IdentificationQuestionOptionValues,
  IdentificationQuestionsId,
} from 'utils/enum/identifications/IdentificationsQuestions';
import {
  indtelIdentificationQuestionsTree,
  transmissionRulesByINDTEL,
  transmissionRulesByINDTELNOR,
} from './questionsTree/indtelQuestionsTree';
import {
  houseF2FIdentificationQuestionsTree,
  transmissionRulesHouseF2F,
} from './questionsTree/houseF2FQuestionsTree';
import {
  houseTelIdentificationQuestionsTree,
  transmissionRulesHouseTel,
} from './questionsTree/HouseTelQuestionsTree';
import { SurveyUnit, SurveyUnitIdentification } from 'types/pearl';
import { getLastState } from '../surveyUnitFunctions';
import { StateValues } from 'utils/enum/SUStateEnum';
import { ContactOutcomeValue } from 'utils/enum/ContactOutcomeEnum';
import { transmissionRulesNoIdentification } from './questionsTree/noIdentificationTransmissionRules';
import { SRCVIdentificationQuestionsTreeFunction } from './questionsTree/SRCVQuestionsTree';

export type IdentificationQuestionOption = {
  value: string;
  label: string;
  concluding: boolean;
};
export type IdentificationQuestionValue = {
  id: IdentificationQuestionsId;
  nextId?: IdentificationQuestionsId;
  text: string;
  options: IdentificationQuestionOption[];
  dependsOn?: { questionId: IdentificationQuestionsId; values: string[] };
  disabled?: boolean;
};

export type IdentificationQuestions = Partial<
  Record<IdentificationQuestionsId, IdentificationQuestionValue>
>;

export const identificationQuestionsTree = (
  identificationConfiguration: IdentificationConfiguration,
  identification?: SurveyUnitIdentification
): Partial<Record<IdentificationQuestionsId, IdentificationQuestionValue>> => {
  switch (identificationConfiguration) {
    case IdentificationConfiguration.INDTEL:
      return indtelIdentificationQuestionsTree;

    case IdentificationConfiguration.IASCO:
      return houseF2FIdentificationQuestionsTree;

    case IdentificationConfiguration.NOIDENT:
      return {};

    case IdentificationConfiguration.HOUSEF2F:
      return houseF2FIdentificationQuestionsTree;

    case IdentificationConfiguration.HOUSETEL:
      return houseTelIdentificationQuestionsTree;

    case IdentificationConfiguration.HOUSETELWSR:
      return houseTelIdentificationQuestionsTree;

    case IdentificationConfiguration.SRCVREINT:
      return SRCVIdentificationQuestionsTreeFunction(identification);

    case IdentificationConfiguration.INDTELNOR:
      return indtelIdentificationQuestionsTree;

    case IdentificationConfiguration.INDF2F:
      return {};

    default:
      return {};
  }
};

export const transmissionRules: Record<IdentificationConfiguration, TransmissionRules> = {
  [IdentificationConfiguration.INDTEL]: transmissionRulesByINDTEL,
  [IdentificationConfiguration.IASCO]: transmissionRulesHouseF2F,
  [IdentificationConfiguration.NOIDENT]: transmissionRulesNoIdentification,
  [IdentificationConfiguration.HOUSEF2F]: transmissionRulesHouseF2F,
  [IdentificationConfiguration.HOUSETEL]: transmissionRulesHouseTel,
  [IdentificationConfiguration.HOUSETELWSR]: transmissionRulesHouseTel,
  [IdentificationConfiguration.INDTELNOR]: transmissionRulesByINDTELNOR,
  [IdentificationConfiguration.INDF2F]: {},
  [IdentificationConfiguration.SRCVREINT]: {},
};

export type ResponseState = Partial<
  Record<IdentificationQuestionsId, IdentificationQuestionOption>
>;

// Type might evolve to make possible any transmission rules match for any identification type possible
export type TransmissionRules = {
  validIfIdentificationFinished?: boolean;
  invalidIfmissingContactOutcome?: boolean;
  invalidIfmissingContactAttempt?: boolean;
  invalidIdentificationsAndContactOutcome?: {
    identifications: {
      questionId: IdentificationQuestionsId;
      value: IdentificationQuestionOptionValues;
    }[];
    contactOutcome: ContactOutcomeValue;
  };
  expectedStateForConctactOutcome?: {
    expectedState: StateValues;
    contactOutcome: ContactOutcomeValue;
  };
};

export function checkAvailability(
  questions: IdentificationQuestions,
  question?: IdentificationQuestionValue,
  responses?: ResponseState
): boolean {
  const disabled = question?.disabled;
  if (disabled) return false;

  if (!responses) return true;
  const dependency = question?.dependsOn;
  if (!dependency) return true;
  if (responses[dependency.questionId]?.concluding) return false;

  // Recursively check if the parent question is itself available
  const parentResponseQuestion = questions[dependency.questionId];
  if (parentResponseQuestion)
    return checkAvailability(questions, parentResponseQuestion, responses);

  // If the parent question has a response, check if its value satisfies the dependency condition
  const parentResponse = responses[dependency.questionId];
  if (parentResponse) return dependency.values.includes(parentResponse.value);

  return true;
}

export function identificationIsFinished(
  identificationConfiguration?: IdentificationConfiguration,
  identification?: SurveyUnitIdentification
): boolean {
  if (!identificationConfiguration) return true;
  if (!identification) return false;

  const questionsTree = identificationQuestionsTree(identificationConfiguration, identification);

  let finished = true;

  // questionsTree is unordered, so we can found an unanswered question but the next could be concluding
  for (const questionId in questionsTree) {
    const questions = questionsTree[questionId as IdentificationQuestionsId];
    if (!questions) continue;

    const response = identification[questions.id];
    if (!response) finished = false;

    const concluding = questions.options.find(o => o.value === response)?.concluding;
    if (concluding) return true;
  }

  return finished;
}

export function isInvalidIdentificationAndContactOutcome(
  transmissionRules: TransmissionRules,
  su: SurveyUnit
): boolean {
  if (
    transmissionRules.invalidIdentificationsAndContactOutcome &&
    su.identification &&
    su.contactOutcome
  ) {
    const identifications =
      transmissionRules.invalidIdentificationsAndContactOutcome.identifications;
    const contactOutcome = transmissionRules.invalidIdentificationsAndContactOutcome.contactOutcome;

    for (const identification of identifications) {
      if (
        su.identification[identification.questionId] === identification.value &&
        su.contactOutcome.type === contactOutcome
      )
        return true;
    }
  }
  return false;
}

export function validateTransmission(su: SurveyUnit): boolean {
  const suTransmissionRules = transmissionRules[su.identificationConfiguration];

  if (suTransmissionRules.validIfIdentificationFinished) {
    if (!identificationIsFinished(su.identificationConfiguration, su.identification)) return false;
  }

  if (suTransmissionRules.invalidIfmissingContactOutcome && !su.contactOutcome) return false;

  if (isInvalidIdentificationAndContactOutcome(suTransmissionRules, su)) return false;

  if (suTransmissionRules.expectedStateForConctactOutcome) {
    if (
      su?.contactOutcome?.type ===
        suTransmissionRules.expectedStateForConctactOutcome.contactOutcome &&
      getLastState(su.states)?.type !==
        suTransmissionRules.expectedStateForConctactOutcome.expectedState
    )
      return false;
  }

  if (suTransmissionRules.invalidIfmissingContactAttempt && !su.contactAttempts.length)
    return false;

  return true;
}
