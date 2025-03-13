import {
  IdentificationQuestionOptionValues,
  IdentificationQuestionsId,
} from 'utils/enum/identifications/IdentificationsQuestions';
import { IdentificationQuestions, TransmissionRules } from '../identificationFunctions';
import D from 'i18n';
import { optionsMap } from './optionsMap';
import { commonTransmissionRules } from './commonTransmissionRules';

export const houseTelIdentificationQuestionsTree: IdentificationQuestions = {
  root: IdentificationQuestionsId.SITUATION,
  values: {
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
  },
} as const;

export const transmissionRulesHOUSETEL: TransmissionRules = {
  ...commonTransmissionRules,
  invalidIdentificationsAndContactOutcome: {
    identifications: [
      {
        questionId: IdentificationQuestionsId.CATEGORY,
        value: IdentificationQuestionOptionValues.PRIMARY,
      },
    ],
    contactOutcome: 'NOA',
  },
};

export const transmissionRulesHOUSETELWSR: TransmissionRules = {
  ...commonTransmissionRules,
  invalidIdentificationsAndContactOutcome: {
    identifications: [
      {
        questionId: IdentificationQuestionsId.CATEGORY,
        value: IdentificationQuestionOptionValues.PRIMARY,
      },
      {
        questionId: IdentificationQuestionsId.CATEGORY,
        value: IdentificationQuestionOptionValues.SECONDARY,
      },
    ],
    contactOutcome: 'NOA',
  },
};
