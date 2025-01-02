import {
  IdentificationConfiguration,
  IdentificationQuestionsId,
} from 'utils/enum/identifications/IdentificationsQuestions';
import {
  indtelIdentificationQuestionsTree,
  transmissionRulesByTel,
} from './questionsTree/indtelQuestionsTree';
import { houseF2FIdentificationQuestionsTree } from './questionsTree/houseF2FQuestionsTree';
import { SurveyUnit, SurveyUnitIdentification } from 'types/pearl';
import { checkValidityForTransmissionNoident, getLastState } from '../surveyUnitFunctions';
import { surveyUnitStateEnum } from 'utils/enum/SUStateEnum';
import { contactOutcomeEnum } from 'utils/enum/ContactOutcomeEnum';

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
  [IdentificationConfiguration.HOUSETEL]: {},
  [IdentificationConfiguration.HOUSETELWSR]: {},
  [IdentificationConfiguration.INDTELNOR]: {},
  [IdentificationConfiguration.INDF2F]: {},
  [IdentificationConfiguration.SRCVREINT]: {},
};

export type ResponseState = Partial<
  Record<IdentificationQuestionsId, IdentificationQuestionOption>
>;

export type TransmissionsRules = {
  identification: SurveyUnitIdentification;
  outcome?: string;
  isValid: boolean;
}[];

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
  identification: Partial<Record<IdentificationQuestionsId, string>>
): boolean {
  const questionsTree = identificationQuestionsTree[identificationConfiguration];
  if (!questionsTree) {
    return false;
  }

  for (const questionId in questionsTree) {
    const question = questionsTree[questionId as IdentificationQuestionsId];
    if (!question) continue;

    const response = identification[question.id];
    if (!response) {
      return false;
    }
  }
  return true;
}

// TODO : must be replaced by validateTransmissionArray (as we're doing for INDTEL)
export const checkValidityForTransmissionIasco = (su: SurveyUnit) => {
  const { contactOutcome, identification, identificationConfiguration, states = [] } = su;

  if (!identificationIsFinished(identificationConfiguration, identification)) return false;

  if (!contactOutcome) return false;

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
      return validateTransmissionArray(transmissionRulesByTel, su);
    case IdentificationConfiguration.NOIDENT:
    default:
      return checkValidityForTransmissionNoident(su);
  }
};

// Must be extented for IASCO
export function validateTransmissionArray(
  transmissionRules: TransmissionsRules,
  su: SurveyUnit
): boolean {
  const outcome = su.contactOutcome?.type;
  const situation = su.identification.situation;
  const individualStatus = su.identification.individualStatus;
  const lastState = getLastState(su.states);

  // If there is no questionnaire, then there is no transmission
  if (lastState?.type !== surveyUnitStateEnum.WAITING_FOR_TRANSMISSION.type) {
    return false;
  }
  const rule = transmissionRules.find(
    r =>
      r.identification.individualStatus === individualStatus &&
      (r.identification.situation === situation || r.identification.situation) &&
      r.outcome === outcome
  );
  return rule?.isValid ?? false;
}
