import {
  IdentificationConfiguration,
  IdentificationQuestionOptionValues,
  IdentificationQuestionsId,
} from 'utils/enum/identifications/IdentificationsQuestions';
import {
  indtelIdentificationQuestionsTree,
  transmissionRulesByTel,
} from './questionsTree/indtelQuestionsTree';
import { houseF2FIdentificationQuestionsTree } from './questionsTree/houseF2FQuestionsTree';
import { houseTelIdentificationQuestionsTree } from './questionsTree/HouseTelQuestionsTree';
import { SurveyUnit } from 'types/pearl';
import { checkValidityForTransmissionNoident, getLastState } from '../surveyUnitFunctions';
import { StateValues, surveyUnitStateEnum } from 'utils/enum/SUStateEnum';
import { contactOutcomeEnum, ContactOutcomeValue } from 'utils/enum/ContactOutcomeEnum';

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
};

export type IdentificationQuestions = Partial<
  Record<IdentificationQuestionsId, IdentificationQuestionValue>
>;

export const identificationQuestionsTree: Record<
  IdentificationConfiguration,
  IdentificationQuestions
> = {
  [IdentificationConfiguration.INDTEL]: indtelIdentificationQuestionsTree,
  [IdentificationConfiguration.IASCO]: houseF2FIdentificationQuestionsTree,
  [IdentificationConfiguration.NOIDENT]: {},
  [IdentificationConfiguration.HOUSEF2F]: houseF2FIdentificationQuestionsTree,
  [IdentificationConfiguration.HOUSETEL]: houseTelIdentificationQuestionsTree,
  [IdentificationConfiguration.HOUSETELWSR]: houseTelIdentificationQuestionsTree,
  [IdentificationConfiguration.INDTELNOR]: {},
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
  invalidIdentificationAndContactOutcome?: {
    identification: {
      questionId: IdentificationQuestionsId;
      value: IdentificationQuestionOptionValues;
    };
    contactOutcome: ContactOutcomeValue;
  };
  invalidStateAndContactOutcome?: { state: StateValues; contactOutcome: ContactOutcomeValue };
};

export function checkAvailability(
  questions: IdentificationQuestions,
  question?: IdentificationQuestionValue,
  responses?: ResponseState
): boolean {
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
  identificationConfiguration: IdentificationConfiguration,
  identification?: SurveyUnitIdentification
): boolean {
  const questionsTree = identificationQuestionsTree[identificationConfiguration];

  if (!identification) return false;

  for (const questionId in questionsTree) {
    const questions = questionsTree[questionId as IdentificationQuestionsId];
    if (!questions) continue;

    const response = identification[questions.id];
    const concluding = questions.options.find(o => o.value === response)?.concluding;
    if (!response) return false;
    else if (concluding) {
      return true;
    }
  }
  return true;
}

// TODO : must be replaced by validateTransmissionArray (as we're doing for INDTEL)
export const checkValidityForTransmissionIasco = (su: SurveyUnit) => {
  const { contactOutcome, identification, identificationConfiguration, states = [] } = su;

  if (!identification || !contactOutcome) return false;
  if (!identificationIsFinished(identificationConfiguration, identification)) return false;

  // INA contactOutcome + no questionnaire
  const type = contactOutcome.type;
  if (
    type === contactOutcomeEnum.INTERVIEW_ACCEPTED.value &&
    getLastState(states)?.type !== surveyUnitStateEnum.WAITING_FOR_TRANSMISSION.type
  )
    return false;

  // issue NOA + identification.avi
  const { identification: identificationValue, category, situation } = identification;
  if (
    type === contactOutcomeEnum.NOT_APPLICABLE.value &&
    identificationQuestionsTree[IdentificationConfiguration.IASCO].identification?.options.find(
      o => o.value === identificationValue && o.concluding
    ) &&
    identificationQuestionsTree[IdentificationConfiguration.IASCO].situation?.options.find(
      o => o.value === situation && o.concluding
    ) &&
    identificationQuestionsTree[IdentificationConfiguration.IASCO].category?.options.find(
      o => o.value === category && o.concluding
    )
  )
    return false;

  return getLastState(states)?.type === surveyUnitStateEnum.WAITING_FOR_TRANSMISSION.type;
};

export const isValidForTransmission = (su: SurveyUnit) => {
  const { identificationConfiguration } = su;
  switch (identificationConfiguration) {
    case IdentificationConfiguration.IASCO:
      return checkValidityForTransmissionIasco(su);
    case IdentificationConfiguration.HOUSEF2F:
      return checkValidityForTransmissionIasco(su);
    case IdentificationConfiguration.INDTEL:
      return validateTransmission(transmissionRulesByTel, su);
    case IdentificationConfiguration.NOIDENT:
    default:
      return checkValidityForTransmissionNoident(su);
  }
};

export function isInvalidIdentificationAndContactOutcome(
  transmissionRules: TransmissionRules,
  su: SurveyUnit
): boolean {
  if (
    transmissionRules.invalidIdentificationAndContactOutcome &&
    su.identification &&
    su.contactOutcome
  ) {
    const questionId =
      transmissionRules.invalidIdentificationAndContactOutcome.identification.questionId;
    const identificationValue =
      transmissionRules.invalidIdentificationAndContactOutcome.identification.value;
    const contactOutcome = transmissionRules.invalidIdentificationAndContactOutcome.contactOutcome;

    return (
      su.identification[questionId] === identificationValue &&
      su.contactOutcome.type === contactOutcome
    );
  }
  return false;
}

// Must be extented for IASCO
export function validateTransmission(
  transmissionRules: TransmissionRules,
  su: SurveyUnit
): boolean {
  if (
    transmissionRules.validIfIdentificationFinished !==
    identificationIsFinished(su.identificationConfiguration, su.identification)
  )
    return false;

  if (transmissionRules.invalidIfmissingContactOutcome && su.contactOutcome === undefined)
    return false;

  if (isInvalidIdentificationAndContactOutcome(transmissionRules, su)) return false;

  if (transmissionRules.invalidStateAndContactOutcome && su.contactOutcome) {
    if (
      su.contactOutcome.type === transmissionRules.invalidStateAndContactOutcome.contactOutcome &&
      getLastState(su.states)?.type === transmissionRules.invalidStateAndContactOutcome.state
    )
      return false;
  }

  return true;
}
