import {
  IdentificationConfiguration,
  IdentificationQuestionsId,
} from 'utils/enum/identifications/IdentificationsQuestionsRefactored';
import D from 'i18n';

export type IdentificationQuestionOption = {
  value: string;
  label: string;
  concluding: boolean;
};
export type IdentificationQuestionValue = {
  text: string;
  options: IdentificationQuestionOption[];
  dependsOn?: { questionId: IdentificationQuestionsId; values: string[] };
};

export type IdentificationQuestions = Partial<
  Record<IdentificationQuestionsId, IdentificationQuestionValue>
>;

// TODO : déplacer identificationQuestionsTel dans un autre fichier ?
export const identificationQuestionsTel: IdentificationQuestions = {
  [IdentificationQuestionsId.IDENTIFICATION]: {
    text: `${D.housingIdentification}`,
    options: [
      { label: `${D.sameAddress}`, value: 'SAMEADRESS', concluding: false },
      { label: `${D.otherAddress}`, value: 'OTHERADRESS', concluding: false },
      { label: `${D.noField}`, value: 'NOFIELD', concluding: true },
      { label: `${D.noIdent}`, value: 'NOIDENT', concluding: true },
      { label: `${D.deceased}`, value: 'DCD', concluding: true },
    ],
  },
  [IdentificationQuestionsId.SITUATION]: {
    text: `${D.housingSituation}`,
    options: [
      { label: `${D.situationOrdinary}`, value: 'ORDINARY', concluding: true },
      { label: `${D.situationNonOrdinary}`, value: 'NOORDINARY', concluding: true },
    ],
    dependsOn: {
      questionId: IdentificationQuestionsId.IDENTIFICATION,
      values: ['SAMEADRESS', 'OTHERADRESS'],
    },
  },
} as const;

// TODO : Construire identificationQuestionsIASCO, identificationQuestionsNoident
export const identificationQuestionsIASCO = {};
export const identificationQuestionsNoIdent = {};

export const identificationQuestions: Record<IdentificationConfiguration, IdentificationQuestions> =
  {
    [IdentificationConfiguration.TEL]: identificationQuestionsTel,
    [IdentificationConfiguration.IASCO]: identificationQuestionsIASCO,
    [IdentificationConfiguration.NOIDENT]: identificationQuestionsNoIdent,
  };

export type ResponseState = Record<IdentificationQuestionsId, IdentificationQuestionOption>;

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
