import {
  IdentificationConfiguration,
  IdentificationQuestionOptionValues,
  IdentificationQuestionsId as IdentificationQuestionId,
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
import { SRCVIdentificationQuestionsTree } from './questionsTree/SRCVQuestionsTree';
import {
  houseTelIdentificationQuestionsTree,
  transmissionRulesHOUSETEL,
  transmissionRulesHOUSETELWSR,
} from './questionsTree/HouseTelQuestionsTree';
import { ContactOutcomeValue } from '../contacts/ContactOutcome';
import {
  indF2FIdentificationQuestionsTree,
  transmissionRulesByINDF2F,
  transmissionRulesByINDF2FNOR,
} from './questionsTree/indF2FQuestionsTree';

export type IdentificationQuestionOption = {
  value: string;
  label: string;
  concluding: boolean;
};
export type IdentificationQuestionValue = {
  id: IdentificationQuestionId;
  nextId?: IdentificationQuestionId;
  text: string;
  options: IdentificationQuestionOption[];
  dependsOn?: { questionId: IdentificationQuestionId; values: string[] };
  disabled?: boolean;
};

export type IdentificationQuestionsMap = Partial<
  Record<IdentificationQuestionId, IdentificationQuestionValue>
>;

export type IdentificationQuestions = {
  map: IdentificationQuestionsMap;
  root?: IdentificationQuestionId;
};

const noIdentQuestionTree: IdentificationQuestions = { map: {} };

export const getIdentificationQuestionsTree = (
  identificationConfiguration: IdentificationConfiguration,
  identification?: SurveyUnitIdentification
) => {
  const identificationMap = {
    [IdentificationConfiguration.INDTEL]: indtelIdentificationQuestionsTree,
    [IdentificationConfiguration.IASCO]: houseF2FIdentificationQuestionsTree,
    [IdentificationConfiguration.NOIDENT]: noIdentQuestionTree,
    [IdentificationConfiguration.HOUSEF2F]: houseF2FIdentificationQuestionsTree,
    [IdentificationConfiguration.HOUSETEL]: houseTelIdentificationQuestionsTree,
    [IdentificationConfiguration.HOUSETELWSR]: houseTelIdentificationQuestionsTree,
    [IdentificationConfiguration.SRCVREINT]: SRCVIdentificationQuestionsTree(identification),
    [IdentificationConfiguration.INDTELNOR]: indtelIdentificationQuestionsTree,
    [IdentificationConfiguration.INDF2F]: indF2FIdentificationQuestionsTree(identification),
    [IdentificationConfiguration.INDF2FNOR]: indF2FIdentificationQuestionsTree(identification),
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
  [IdentificationConfiguration.INDF2F]: transmissionRulesByINDF2F,
  [IdentificationConfiguration.INDF2FNOR]: transmissionRulesByINDF2FNOR,
  [IdentificationConfiguration.SRCVREINT]: transmissionRulesNoIdentification,
};

export type ResponseState = Partial<Record<IdentificationQuestionId, IdentificationQuestionOption>>;

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
  invalidIdentification?: {
    id: IdentificationQuestionId;
    value: IdentificationQuestionOptionValues;
  };
};

export function checkAvailability(
  identificationQuestionsMap?: IdentificationQuestionsMap,
  question?: IdentificationQuestionValue,
  responses?: ResponseState
): boolean {
  if (!identificationQuestionsMap) return false;
  if (question?.disabled) return false;
  if (!responses) return true;
  const dependency = question?.dependsOn;
  if (!dependency) return true;
  if (responses[dependency.questionId]?.concluding) return false;

  // Recursively check if the parent question is itself available
  const parentResponseQuestion = identificationQuestionsMap[dependency.questionId];
  if (parentResponseQuestion)
    return checkAvailability(identificationQuestionsMap, parentResponseQuestion, responses);

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

  const questionsMap = getIdentificationQuestionsTree(identificationConfiguration, identification);
  if (!questionsMap) return true;

  const root = questionsMap.root;
  const questions = questionsMap.map;

  if (!root || !questions) return true;
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

export function isValidIdentification(
  invalidIdentification?: {
    id: IdentificationQuestionId;
    value: IdentificationQuestionOptionValues;
  },
  suIdentification?: SurveyUnitIdentification
) {
  if (!suIdentification || !invalidIdentification) return true;

  return suIdentification[invalidIdentification.id] !== invalidIdentification.value;
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

  if (!isValidIdentification(suTransmissionRules.invalidIdentification, su.identification))
    return false;

  return true;
}
