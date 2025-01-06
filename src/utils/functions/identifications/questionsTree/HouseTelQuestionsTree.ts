import { IdentificationQuestionsId } from 'utils/enum/identifications/IdentificationsQuestions';
import { IdentificationQuestions } from '../identificationFunctions';
import D from 'i18n';

export const houseTelIdentificationQuestionsTree: IdentificationQuestions = {
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
