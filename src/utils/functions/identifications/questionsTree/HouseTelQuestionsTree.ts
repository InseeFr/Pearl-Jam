import {
  IdentificationQuestionOptionValues,
  IdentificationQuestionsId,
} from 'utils/enum/identifications/IdentificationsQuestions';
import { IdentificationQuestions, TransmissionRules } from '../identificationFunctions';
import D from 'i18n';
import { optionsMap } from './optionsMap';

export const houseTelIdentificationQuestionsTree: IdentificationQuestions = {
  [IdentificationQuestionsId.SITUATION]: {
    id: IdentificationQuestionsId.SITUATION,
    nextId: IdentificationQuestionsId.CATEGORY,
    text: `${D.housingSituation}`,
    options: [
      { ...optionsMap.ORDINARY, concluding: false },
      { ...optionsMap.ABSORBED, concluding: true },
      { ...optionsMap.NOORDINARY, concluding: true },
    ],
  },
  [IdentificationQuestionsId.CATEGORY]: {
    id: IdentificationQuestionsId.CATEGORY,
    text: `${D.housingCategory}`,
    options: [
      { ...optionsMap.PRIMARY, concluding: true },
      { ...optionsMap.SECONDARY, concluding: true },
      { ...optionsMap.VACANT, concluding: true },
    ],
    dependsOn: {
      questionId: IdentificationQuestionsId.SITUATION,
      values: ['ORDINARY'],
    },
  },
} as const;

export const transmissionRulesHOUSETEL: TransmissionRules = {
  validIfIdentificationFinished: true,
  invalidIdentificationsAndContactOutcome: {
    identifications: [
      {
        questionId: IdentificationQuestionsId.CATEGORY,
        value: IdentificationQuestionOptionValues.ORDINARY,
      },
      {
        questionId: IdentificationQuestionsId.CATEGORY,
        value: IdentificationQuestionOptionValues.NOORDINARY,
      },
    ],
    contactOutcome: 'NOA',
  },
  invalidIfmissingContactOutcome: true,
  invalidIfmissingContactAttempt: true,
  expectedStateForConctactOutcome: { expectedState: 'WFT', contactOutcome: 'INA' },
};

export const transmissionRulesHOUSETELWSR: TransmissionRules = {
  validIfIdentificationFinished: true,
  invalidIdentificationsAndContactOutcome: {
    identifications: [
      {
        questionId: IdentificationQuestionsId.SITUATION,
        value: IdentificationQuestionOptionValues.PRIMARY,
      },
      {
        questionId: IdentificationQuestionsId.SITUATION,
        value: IdentificationQuestionOptionValues.SECONDARY,
      },
    ],
    contactOutcome: 'NOA',
  },
  invalidIfmissingContactOutcome: true,
  invalidIfmissingContactAttempt: true,
  expectedStateForConctactOutcome: { expectedState: 'WFT', contactOutcome: 'INA' },
};
