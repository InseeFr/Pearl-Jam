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
