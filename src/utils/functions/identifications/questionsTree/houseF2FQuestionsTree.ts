import {
  IdentificationQuestionOptionValues,
  IdentificationQuestionsId,
} from 'utils/enum/identifications/IdentificationsQuestions';
import { IdentificationQuestions, TransmissionsRules } from '../identificationFunctions';
import D from 'i18n';
import { contactOutcomeEnum } from 'utils/enum/ContactOutcomeEnum';
import { optionsMap } from './optionsMap';

export const indtelIdentificationQuestionsTree: IdentificationQuestions = {
  [IdentificationQuestionsId.INDIVIDUAL_STATUS]: {
    id: IdentificationQuestionsId.INDIVIDUAL_STATUS,
    nextId: IdentificationQuestionsId.SITUATION,
    text: `${D.housingIdentification}`,
    options: [
      { ...optionsMap.SAME_ADDRESS, concluding: false },
      { ...optionsMap.OTHER_ADDRESS, concluding: false },
      { ...optionsMap.NOFIELD, concluding: true },
      { ...optionsMap.NOIDENT, concluding: true },
      { ...optionsMap.DCD, concluding: true },
    ],
  },
  [IdentificationQuestionsId.SITUATION]: {
    id: IdentificationQuestionsId.SITUATION,
    text: `${D.housingSituation}`,
    options: [
      { ...optionsMap.ORDINARY, concluding: true },
      { ...optionsMap.NOORDINARY, concluding: true },
    ],
    dependsOn: {
      questionId: IdentificationQuestionsId.INDIVIDUAL_STATUS,
      values: [
        IdentificationQuestionOptionValues.SAME_ADDRESS,
        IdentificationQuestionOptionValues.OTHER_ADDRESS,
      ],
    },
  },
} as const;

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

export const transmissionRulesByTel: TransmissionsRules = [
  {
    identification: {
      individualStatus: IdentificationQuestionOptionValues.SAME_ADDRESS,
      situation: IdentificationQuestionOptionValues.ORDINARY,
    },
    outcome: contactOutcomeEnum.INTERVIEW_ACCEPTED.value,
    isValid: true,
  },
  {
    identification: {
      individualStatus: IdentificationQuestionOptionValues.SAME_ADDRESS,
      situation: IdentificationQuestionOptionValues.ORDINARY,
    },
    outcome: contactOutcomeEnum.REFUSAL.value,
    isValid: true,
  },
  {
    identification: {
      individualStatus: IdentificationQuestionOptionValues.SAME_ADDRESS,
      situation: IdentificationQuestionOptionValues.ORDINARY,
    },
    outcome: contactOutcomeEnum.IMPOSSIBLE_TO_REACH.value,
    isValid: false,
  },
  {
    identification: {
      individualStatus: IdentificationQuestionOptionValues.OTHER_ADDRESS,
      situation: IdentificationQuestionOptionValues.NOORDINARY,
    },
    outcome: contactOutcomeEnum.INTERVIEW_ACCEPTED.value,
    isValid: true,
  },
  {
    identification: { individualStatus: IdentificationQuestionOptionValues.NOIDENT },
    outcome: contactOutcomeEnum.INTERVIEW_ACCEPTED.value,
    isValid: false,
  },
  {
    identification: { individualStatus: IdentificationQuestionOptionValues.DCD },
    outcome: contactOutcomeEnum.INTERVIEW_ACCEPTED.value,
    isValid: false,
  },
];
