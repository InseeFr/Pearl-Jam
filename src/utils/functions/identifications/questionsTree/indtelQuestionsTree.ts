import {
  IdentificationQuestionsId,
  IdentificationQuestionOptionValues,
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

export const transmissionRulesByTel: TransmissionRules = {
  validIfIdentificationFinished: true,
  invalidIdentificationAndContactOutcome: {
    identification: {
      questionId: IdentificationQuestionsId.SITUATION,
      value: IdentificationQuestionOptionValues.ORDINARY,
    },
    contactOutcome: 'NOA',
  },
  invalidIfmissingContactOutcome: true,
  invalidStateAndContactOutcome: { state: 'WFT', contactOutcome: 'INA' },
};
