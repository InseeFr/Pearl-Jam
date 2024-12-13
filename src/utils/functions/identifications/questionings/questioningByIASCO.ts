import { IdentificationQuestionsId } from 'utils/enum/identifications/IdentificationsQuestions';
import { IdentificationQuestions } from '../identificationFunctions';
import D from 'i18n';

export const identificationQuestionsIASCO: IdentificationQuestions = {
  [IdentificationQuestionsId.IDENTIFICATION]: {
    id: IdentificationQuestionsId.IDENTIFICATION,
    nextId: IdentificationQuestionsId.ACCES,
    text: `${D.housingIdentification}`,
    options: [
      { label: `${D.identificationIdentified}`, value: 'IDENTIFIED', concluding: false },
      { label: `${D.identificationUnidentified}`, value: 'UNIDENTIFIED', concluding: false },
      { label: `${D.identificationDestroy}`, value: 'DESTROY', concluding: true },
    ],
  },
  [IdentificationQuestionsId.ACCES]: {
    id: IdentificationQuestionsId.ACCES,
    nextId: IdentificationQuestionsId.SITUATION,
    text: `${D.housingAccess}`,
    options: [
      { label: `${D.accessibleHousing}`, value: 'ACC', concluding: false },
      { label: `${D.notAccessibleHousing}`, value: 'NACC', concluding: false },
    ],
    dependsOn: {
      questionId: IdentificationQuestionsId.IDENTIFICATION,
      values: ['IDENTIFIED', 'UNIDENTIFIED'],
    },
  },
  [IdentificationQuestionsId.SITUATION]: {
    id: IdentificationQuestionsId.SITUATION,
    nextId: IdentificationQuestionsId.CATEGORY,
    text: `${D.housingSituation}`,
    options: [
      { label: `${D.situationOrdinary}`, value: 'ORDINARY', concluding: false },
      { label: `${D.situationNotOrdinary}`, value: 'NOORDINARY', concluding: true },
      { label: `${D.situationAbsorbed}`, value: 'ABSORBED', concluding: true },
    ],
    dependsOn: {
      questionId: IdentificationQuestionsId.ACCES,
      values: ['ACC', 'NACC'],
    },
  },

  [IdentificationQuestionsId.CATEGORY]: {
    id: IdentificationQuestionsId.CATEGORY,
    nextId: IdentificationQuestionsId.OCCUPANT,
    text: `${D.housingCategory}`,
    options: [
      { label: `${D.categoryPrimary}`, value: 'PRIMARY', concluding: false },
      { label: `${D.categorySecondary}`, value: 'SECONDARY', concluding: true },
      { label: `${D.categoryOccasional}`, value: 'OCCASIONAL', concluding: false },
      { label: `${D.categoryVacant}`, value: 'VACANT', concluding: true },
    ],
    dependsOn: {
      questionId: IdentificationQuestionsId.SITUATION,
      values: ['ORDINARY'],
    },
  },
  [IdentificationQuestionsId.OCCUPANT]: {
    id: IdentificationQuestionsId.OCCUPANT,
    text: `${D.housingOccupant}`,
    options: [
      { label: `${D.occupantIdentified}`, value: 'IDENTIFIED', concluding: true },
      { label: `${D.occupantUnidentified}`, value: 'UNIDENTIFIED', concluding: true },
    ],
    dependsOn: {
      questionId: IdentificationQuestionsId.CATEGORY,
      values: ['PRIMARY', 'OCCASIONAL'],
    },
  },
} as const;
