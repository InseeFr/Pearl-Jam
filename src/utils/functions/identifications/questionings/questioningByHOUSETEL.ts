import { IdentificationQuestionsId } from 'utils/enum/identifications/IdentificationsQuestionsRefactored';
import { IdentificationQuestions } from '../identificationFunctionsRefactored';
import D from 'i18n';

export const identificationQuestionsHousetel: IdentificationQuestions = {
  [IdentificationQuestionsId.SITUATION]: {
    id: IdentificationQuestionsId.SITUATION,
    nextId: IdentificationQuestionsId.CATEGORY,
    text: `${D.housingSituation}`,
    options: [
      { label: `${D.situationOrdinary}`, value: 'ORDINARY', concluding: false },
      { label: `${D.absorbed}`, value: 'ABSORBED', concluding: true },
      { label: `${D.situationNonOrdinary}`, value: 'NOORDINARY', concluding: true },
    ],
  },
  [IdentificationQuestionsId.CATEGORY]: {
    id: IdentificationQuestionsId.CATEGORY,
    text: `${D.housingCategory}`,
    options: [
      { label: `${D.categoryPrimary}`, value: 'PRIMARY', concluding: true },
      { label: `${D.categorySecondary}`, value: 'SECONDARY', concluding: true },
      { label: `${D.vacant}`, value: 'VACANT', concluding: true },
    ],
    dependsOn: {
      questionId: IdentificationQuestionsId.SITUATION,
      values: ['ORDINARY'],
    },
  },
} as const;
