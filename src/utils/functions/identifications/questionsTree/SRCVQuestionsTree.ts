import {
  IdentificationQuestionOptionValues,
  IdentificationQuestionsId,
} from 'utils/enum/identifications/IdentificationsQuestions';
import { IdentificationQuestions, TransmissionRules } from '../identificationFunctions';
import D from 'i18n';
import { optionsMap } from './optionsMap';

// TODO : transformer en fonction qui retourne un IdentificationQuestions
// (response) => IdentificationQuestions
export const SRCVIdentificationQuestionsTree: IdentificationQuestions = {
  [IdentificationQuestionsId.NUMBER_OF_RESPONDENTS]: {
    id: IdentificationQuestionsId.NUMBER_OF_RESPONDENTS,
    nextId: IdentificationQuestionsId.INDIVIDUAL_STATUS,
    text: `${D.numberOfRespondents}`,
    options: [
      { ...optionsMap.ONE, concluding: false },
      { ...optionsMap.MANY, concluding: false },
    ],
  },
  [IdentificationQuestionsId.INDIVIDUAL_STATUS]: {
    id: IdentificationQuestionsId.INDIVIDUAL_STATUS,
    nextId: IdentificationQuestionsId.HOUSEHOLD_COMPOSITION,
    text: `${D.housingAccess}`,
    options: [
      { ...optionsMap.SAME_HOUSE, concluding: true },
      { ...optionsMap.OTHER_HOUSE, concluding: false },
      { ...optionsMap.NOFIELD, concluding: false },
      { ...optionsMap.NOIDENT, concluding: true },
      { ...optionsMap.DCD, concluding: true },
    ],
    dependsOn: {
      questionId: IdentificationQuestionsId.IDENTIFICATION,
      values: [IdentificationQuestionOptionValues.ONE, IdentificationQuestionOptionValues.MANY],
    },
  },
  [IdentificationQuestionsId.HOUSEHOLD_COMPOSITION]: {
    id: IdentificationQuestionsId.HOUSEHOLD_COMPOSITION,
    nextId: IdentificationQuestionsId.PRESENT_IN_PREVIOUS_HOME,
    text: `${D.housingSituation}`,
    options: [
      { ...optionsMap.SAME_COMPO, concluding: false },
      { ...optionsMap.OTHER_COMPO, concluding: true },
    ],
    // dependsOn: {
    //   questionId: IdentificationQuestionsId.ACCESS,
    //   values: [IdentificationQuestionOptionValues.ACC, IdentificationQuestionOptionValues.NACC],
    // },
    disableQuestion: {
      questionId: IdentificationQuestionsId.NUMBER_OF_RESPONDENTS,
      value: optionsMap.ONE.value,
    },
  },

  [IdentificationQuestionsId.PRESENT_IN_PREVIOUS_HOME]: {
    id: IdentificationQuestionsId.PRESENT_IN_PREVIOUS_HOME,
    nextId: IdentificationQuestionsId.SITUATION,
    text: `${D.presentInPreviousHome}`,
    options: [
      { ...optionsMap.NO_IN_OLD_HOUSE, concluding: false },
      { ...optionsMap.IN_OLD_HOUSE, concluding: true },
    ],
    // dependsOn: {
    //   questionId: IdentificationQuestionsId.SITUATION,
    //   values: [IdentificationQuestionOptionValues.ORDINARY],
    // },
    disableQuestion: {
      questionId: IdentificationQuestionsId.NUMBER_OF_RESPONDENTS,
      value: optionsMap.ONE.value,
    },
  },
  [IdentificationQuestionsId.SITUATION]: {
    id: IdentificationQuestionsId.SITUATION,
    text: `${D.housingOccupant}`,
    options: [
      { ...optionsMap.ORDINARY, concluding: true },
      { ...optionsMap.NOORDINARY, concluding: true },
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

export const transmissionRulesHouseF2F: TransmissionRules = {
  validIfIdentificationFinished: true,
  invalidIdentificationsAndContactOutcome: {
    identifications: [
      {
        questionId: IdentificationQuestionsId.OCCUPANT,
        value: IdentificationQuestionOptionValues.IDENTIFIED,
      },
      {
        questionId: IdentificationQuestionsId.OCCUPANT,
        value: IdentificationQuestionOptionValues.UNIDENTIFIED,
      },
    ],
    contactOutcome: 'NOA',
  },
  invalidIfmissingContactOutcome: true,
  invalidIfmissingContactAttempt: true,
  expectedStateForConctactOutcome: { expectedState: 'WFT', contactOutcome: 'INA' },
};
