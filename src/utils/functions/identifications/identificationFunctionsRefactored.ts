import { IdentificationQuestionsId } from 'utils/enum/identifications/IdentificationsQuestionsRefactored';
import D from 'i18n';

export type IdentificationQuestionValueOption = {
  value: string;
  label: string;
  concluding: boolean;
};
export type IdentificationQuestionValue = {
  text: string;
  options: IdentificationQuestionValueOption[];
  dependsOn?: { questionId: IdentificationQuestionsId; values: string[] };
};

export type IdentificationQuestions = Record<
  IdentificationQuestionsId,
  IdentificationQuestionValue
>;

// TO DO : IdentificationQuestionsTel, IdentificationQuestionsIASCO, IdentificationQuestionsSRCV
export const questions: IdentificationQuestions = {
  [IdentificationQuestionsId.ID_PERSON]: {
    text: `${D.housingIdentification}`,
    options: [
      { label: `${D.sameAddress}`, value: 'SAMEADRESS', concluding: false },
      { label: `${D.otherAddress}`, value: 'OTHERADRESS', concluding: false },
      { label: `${D.noField}`, value: 'NOFIELD', concluding: true },
      { label: `${D.noIdent}`, value: 'NOIDENT', concluding: true },
      { label: `${D.deceased}`, value: 'DCD', concluding: true },
    ],
  },
  [IdentificationQuestionsId.ID_SITUATION]: {
    text: `${D.housingSituation}`,
    options: [
      { label: `${D.situationNonOrdinary}`, value: 'NOORDINARY', concluding: true },
      { label: `${D.identificationIdentified}`, value: 'ORDINARY', concluding: true },
    ],
    dependsOn: {
      questionId: IdentificationQuestionsId.ID_PERSON,
      values: ['SAMEADRESS', 'OTHERADRESS'],
    },
  },
} as const;

export type ResponseState = Record<IdentificationQuestionsId, IdentificationQuestionValueOption>;

export function checkAvailability(
  question: IdentificationQuestionValue,
  dependancyOption?: ResponseState
): boolean {
  if (!question.dependsOn) return true;
  if (!dependancyOption) return true;

  const questionId = question.dependsOn.questionId;
  if (!dependancyOption[questionId]) return true;

  return question.dependsOn.values.some(v => v === dependancyOption[questionId].value) ?? false;
}
