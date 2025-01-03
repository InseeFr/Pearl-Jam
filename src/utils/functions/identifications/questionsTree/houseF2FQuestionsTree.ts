import {
  IdentificationQuestionOptionValues,
  IdentificationQuestionsId,
} from 'utils/enum/identifications/IdentificationsQuestions';
import { IdentificationQuestions } from '../identificationFunctions';
import D from 'i18n';
import { optionsMap } from './optionsMap';

export const houseF2FIdentificationQuestionsTree: IdentificationQuestions = {
  [IdentificationQuestionsId.IDENTIFICATION]: {
    id: IdentificationQuestionsId.IDENTIFICATION,
    nextId: IdentificationQuestionsId.ACCESS,
    text: `${D.housingIdentification}`,
    options: [
      { ...optionsMap.IDENTIFIED, concluding: false },
      { ...optionsMap.UNIDENTIFIED, concluding: false },
      { ...optionsMap.DESTROY, concluding: true },
    ],
  },
  [IdentificationQuestionsId.ACCESS]: {
    id: IdentificationQuestionsId.ACCESS,
    nextId: IdentificationQuestionsId.SITUATION,
    text: `${D.housingAccess}`,
    options: [
      { ...optionsMap.ACC, concluding: false },
      { ...optionsMap.NACC, concluding: false },
    ],
    dependsOn: {
      questionId: IdentificationQuestionsId.IDENTIFICATION,
      values: [
        IdentificationQuestionOptionValues.IDENTIFIED,
        IdentificationQuestionOptionValues.UNIDENTIFIED,
      ],
    },
  },
  [IdentificationQuestionsId.SITUATION]: {
    id: IdentificationQuestionsId.SITUATION,
    nextId: IdentificationQuestionsId.CATEGORY,
    text: `${D.housingSituation}`,
    options: [
      { ...optionsMap.ORDINARY, concluding: false },
      { ...optionsMap.NOORDINARY, concluding: true },
      { ...optionsMap.ABSORBED, concluding: true },
    ],
    dependsOn: {
      questionId: IdentificationQuestionsId.ACCESS,
      values: [IdentificationQuestionOptionValues.ACC, IdentificationQuestionOptionValues.NACC],
    },
  },

  [IdentificationQuestionsId.CATEGORY]: {
    id: IdentificationQuestionsId.CATEGORY,
    nextId: IdentificationQuestionsId.OCCUPANT,
    text: `${D.housingCategory}`,
    options: [
      { ...optionsMap.PRIMARY, concluding: false },
      { ...optionsMap.SECONDARY, concluding: true },
      { ...optionsMap.OCCASIONAL, concluding: false },
      { ...optionsMap.VACANT, concluding: true },
    ],
    dependsOn: {
      questionId: IdentificationQuestionsId.SITUATION,
      values: [IdentificationQuestionOptionValues.ORDINARY],
    },
  },
  [IdentificationQuestionsId.OCCUPANT]: {
    id: IdentificationQuestionsId.OCCUPANT,
    text: `${D.housingOccupant}`,
    options: [
      { ...optionsMap.IDENTIFIED, concluding: true },
      { ...optionsMap.UNIDENTIFIED, concluding: true },
    ],
    dependsOn: {
      questionId: IdentificationQuestionsId.CATEGORY,
      values: [
        IdentificationQuestionOptionValues.PRIMARY,
        IdentificationQuestionOptionValues.OCCASIONAL,
      ],
    },
  },
} as const;
