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
import { SurveyUnit, SurveyUnitIdentification } from 'types/pearl';
import { getLastState } from '../surveyUnitFunctions';
import { StateValues } from 'utils/enum/SUStateEnum';
import { transmissionRulesNoIdentification } from './questionsTree/noIdentificationTransmissionRules';
import { SRCVIdentificationQuestionsTreeFunction as SRCVIdentificationQuestionsTree } from './questionsTree/SRCVQuestionsTree';
import { ContactOutcomeValue } from '../contacts/ContactOutcome';
import {
  houseTelIdentificationQuestionsTree,
  transmissionRulesHOUSETEL,
  transmissionRulesHOUSETELWSR,
} from './questionsTree/HouseTelQuestionsTree';
import { indTelIdentificationQuestionsTree } from './questionsTree/indF2FQuestionsTree';

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
> & {
  root?: IdentificationQuestionsId;
};

export const getIdentificationQuestionsTree = (
  identificationConfiguration: IdentificationConfiguration,
  identification?: SurveyUnitIdentification
): IdentificationQuestions => {
  const identificationMap: Record<IdentificationConfiguration, IdentificationQuestions> = {
    [IdentificationConfiguration.INDTEL]: indtelIdentificationQuestionsTree,
    [IdentificationConfiguration.IASCO]: houseF2FIdentificationQuestionsTree,
    [IdentificationConfiguration.NOIDENT]: {},
    [IdentificationConfiguration.HOUSEF2F]: houseF2FIdentificationQuestionsTree,
    [IdentificationConfiguration.HOUSETEL]: houseTelIdentificationQuestionsTree,
    [IdentificationConfiguration.HOUSETELWSR]: houseTelIdentificationQuestionsTree,
    [IdentificationConfiguration.SRCVREINT]: SRCVIdentificationQuestionsTree(identification),
    [IdentificationConfiguration.INDTELNOR]: indtelIdentificationQuestionsTree,
    [IdentificationConfiguration.INDF2F]: indTelIdentificationQuestionsTree(identification),
  };

  return identificationMap[identificationConfiguration];
};

export const transmissionRules: Record<IdentificationConfiguration, TransmissionRules> = {
  [IdentificationConfiguration.INDTEL]: transmissionRulesByINDTEL,
  [IdentificationConfiguration.IASCO]: transmissionRulesHouseF2F,
  [IdentificationConfiguration.NOIDENT]: transmissionRulesNoIdentification,
  [IdentificationConfiguration.HOUSEF2F]: transmissionRulesHouseF2F,
  [IdentificationConfiguration.HOUSETEL]: transmissionRulesHOUSETEL,
  [IdentificationConfiguration.HOUSETELWSR]: transmissionRulesHOUSETELWSR,
  [IdentificationConfiguration.INDTELNOR]: transmissionRulesByINDTELNOR,
  [IdentificationConfiguration.INDF2F]: transmissionRulesNoIdentification,
  [IdentificationConfiguration.SRCVREINT]: transmissionRulesNoIdentification,
};

export type ResponseState = Partial<
  Record<IdentificationQuestionsId, IdentificationQuestionOption>
>;

export type TransmissionRules = {
  shouldValidIfIdentificationFinished: boolean;
  invalidIfmissingContactOutcome: boolean;
  invalidIfmissingContactAttempt: boolean;
  invalidIdentificationsAndContactOutcome?: {
    identifications: {
      questionId: IdentificationQuestionsId;
      value: IdentificationQuestionOptionValues;
    }[];
    contactOutcome: ContactOutcomeValue;
  };
  expectedState: StateValues;
};

export function checkAvailability(
  questions: IdentificationQuestions,
  question?: IdentificationQuestionValue,
  responses?: ResponseState
): boolean {
  if (question?.disabled) return false;

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

export function isIdentificationFinished(
  identificationConfiguration?: IdentificationConfiguration,
  identification?: SurveyUnitIdentification
): boolean {
  if (!identificationConfiguration) return true;
  if (!identification) return false;

  const questions = getIdentificationQuestionsTree(identificationConfiguration, identification);
  const root = questions.root;

  if (!root) return true;
  let question = questions[root];

  while (question) {
    const response = identification[question.id];
    if (response) {
      const isConcluding = question.options.find(o => o.value === response && o.concluding);

      if (isConcluding) return true;
    }

    if (question.nextId) {
      question = questions[question.nextId];
    } else {
      question = undefined;
    }
  }

  return false;
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
      ) {
        return true;
      }
    }
  }
  return false;
}

function isValidStateForContactOutcome(su: SurveyUnit, suTransmissionRules: TransmissionRules) {
  const lastStateType = getLastState(su.states)?.type;
  const hasExpectedState = lastStateType === suTransmissionRules.expectedState;

  // when questionnaireState is available, use it here for consistency
  // => if contactOutcome=INA then check if questionnaireState is VALIDATED
  return hasExpectedState;
}

export function validateTransmission(su: SurveyUnit): boolean {
  const suTransmissionRules = transmissionRules[su.identificationConfiguration];

  // identification completion
  if (suTransmissionRules.shouldValidIfIdentificationFinished) {
    if (!isIdentificationFinished(su.identificationConfiguration, su.identification)) return false;
  }

  // contactOutcome requirement
  if (suTransmissionRules.invalidIfmissingContactOutcome && !su.contactOutcome) return false;

  // at least one contactAttempt
  if (suTransmissionRules.invalidIfmissingContactAttempt && !su.contactAttempts.length)
    return false;

  // consistency between identification and contactOutcome
  if (isInvalidIdentificationAndContactOutcome(suTransmissionRules, su)) return false;

  // consistency between state and contactOutcome
  if (!isValidStateForContactOutcome(su, suTransmissionRules)) return false;

  return true;
}
