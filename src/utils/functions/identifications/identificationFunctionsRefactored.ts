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
      { label: IdentificationPersonOption.SAMEADRESS, value: 'SAMEADRESS', concluding: false },
      { label: IdentificationPersonOption.OTHERADRESS, value: 'OTHERADRESS', concluding: false },
      { label: IdentificationPersonOption.NOFIELD, value: 'NOFIELD', concluding: true },
      { label: IdentificationPersonOption.NOIDENT, value: 'NOIDENT', concluding: true },
      { label: IdentificationPersonOption.DCD, value: 'DCD', concluding: true },
    ],
  },
  [IdentificationQuestionsId.ID_SITUATION]: {
    text: `${D.housingSituation}`,
    options: [
      { label: IdentificationSituationOption.NOORDINARY, value: 'NOORDINARY', concluding: true },
      { label: IdentificationSituationOption.ORDINARY, value: 'ORDINARY', concluding: true },
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
