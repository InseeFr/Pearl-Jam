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
      { label: `${D.absorbed}`, value: 'ABSORBED', concluding: true },
      { ...optionsMap.NOORDINARY, concluding: true },
    ],
  },
  [IdentificationQuestionsId.CATEGORY]: {
    id: IdentificationQuestionsId.CATEGORY,
    text: `${D.housingCategory}`,
    options: [
      { ...optionsMap.PRIMARY, concluding: true },
      { ...optionsMap.SECONDARY, concluding: true },
      { label: `${D.vacant}`, value: 'VACANT', concluding: true },
    ],
    dependsOn: {
      questionId: IdentificationQuestionsId.SITUATION,
      values: ['ORDINARY'],
    },
  },
} as const;

export const transmissionRulesHouseTel: TransmissionRules = {
  validIfIdentificationFinished: true,
  invalidIdentificationsAndContactOutcome: {
    identifications: [
      {
        questionId: IdentificationQuestionsId.SITUATION,
        value: IdentificationQuestionOptionValues.ORDINARY,
      },
      {
        questionId: IdentificationQuestionsId.SITUATION,
        value: IdentificationQuestionOptionValues.NOORDINARY,
      },
    ],
    contactOutcome: 'NOA',
  },
  invalidIfmissingContactOutcome: true,
  invalidStateAndContactOutcome: { state: 'WFT', contactOutcome: 'INA' },
};
