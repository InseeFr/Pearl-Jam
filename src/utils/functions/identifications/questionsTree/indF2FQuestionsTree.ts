import {
  IdentificationQuestionsId,
  IdentificationQuestionOptionValues,
} from 'utils/enum/identifications/IdentificationsQuestions';
import { IdentificationQuestions, IdentificationQuestionValue } from '../identificationFunctions';
import D from 'i18n';
import { optionsMap } from './optionsMap';
import { SurveyUnitIdentification } from 'types/pearl';

const individualStatusDefault: IdentificationQuestionValue = {
  id: IdentificationQuestionsId.INDIVIDUAL_STATUS,
  nextId: IdentificationQuestionsId.INTERVIEWER_CAN_PROCESS,
  text: `${D.foundIndividual}`,
  options: [
    { ...optionsMap.SAME_ADDRESS, concluding: false },
    { ...optionsMap.OTHER_ADDRESS, concluding: false },
    { ...optionsMap.NOFIELD, concluding: true },
    { ...optionsMap.NOIDENT, concluding: true },
    { ...optionsMap.DCD, concluding: true },
  ],
};

const individualStatusSameAdress = {
  ...individualStatusDefault,
  nextId: IdentificationQuestionsId.SITUATION,
};

const individualStatusOtherAdress = {
  ...individualStatusDefault,
  nextId: IdentificationQuestionsId.INTERVIEWER_CAN_PROCESS,
};

const interviewerCanProcess: IdentificationQuestionValue = {
  id: IdentificationQuestionsId.INTERVIEWER_CAN_PROCESS,
  nextId: IdentificationQuestionsId.SITUATION,
  text: `${D.interviewerProcess}`,
  options: [
    { ...optionsMap.TREAT, concluding: false },
    { ...optionsMap.NOTREAT, concluding: true },
  ],
  dependsOn: {
    questionId: IdentificationQuestionsId.INDIVIDUAL_STATUS,
    values: [IdentificationQuestionOptionValues.OTHER_ADDRESS],
  },
};

const interviewerCanProcessDisabled: IdentificationQuestionValue = {
  ...interviewerCanProcess,
  disabled: true,
};

const situationSameAdress: IdentificationQuestionValue = {
  id: IdentificationQuestionsId.SITUATION,
  text: `${D.housingSituation}`,
  options: [
    { ...optionsMap.ORDINARY, concluding: true },
    { ...optionsMap.NOORDINARY, concluding: true },
  ],
  dependsOn: {
    questionId: IdentificationQuestionsId.INDIVIDUAL_STATUS,
    values: [IdentificationQuestionOptionValues.SAME_ADDRESS],
  },
};

const situationOtherAdress: IdentificationQuestionValue = {
  ...situationSameAdress,
  dependsOn: {
    questionId: IdentificationQuestionsId.INTERVIEWER_CAN_PROCESS,
    values: [IdentificationQuestionOptionValues.TREAT],
  },
};

export const indTelIdentificationQuestionsTree = (
  identification?: SurveyUnitIdentification
): IdentificationQuestions => {
  if (identification?.individualStatus === IdentificationQuestionOptionValues.SAME_ADDRESS) {
    return {
      root: IdentificationQuestionsId.INDIVIDUAL_STATUS,
      [IdentificationQuestionsId.INDIVIDUAL_STATUS]: individualStatusSameAdress,
      [IdentificationQuestionsId.INTERVIEWER_CAN_PROCESS]: interviewerCanProcessDisabled,
      [IdentificationQuestionsId.SITUATION]: situationSameAdress,
    };
  }
  if (identification?.individualStatus === IdentificationQuestionOptionValues.OTHER_ADDRESS) {
    return {
      root: IdentificationQuestionsId.INDIVIDUAL_STATUS,
      [IdentificationQuestionsId.INDIVIDUAL_STATUS]: individualStatusOtherAdress,
      [IdentificationQuestionsId.INTERVIEWER_CAN_PROCESS]: interviewerCanProcess,
      [IdentificationQuestionsId.SITUATION]: situationOtherAdress,
    };
  }
  return {
    root: IdentificationQuestionsId.INDIVIDUAL_STATUS,
    [IdentificationQuestionsId.INDIVIDUAL_STATUS]: individualStatusDefault,
    [IdentificationQuestionsId.INTERVIEWER_CAN_PROCESS]: interviewerCanProcess,
    [IdentificationQuestionsId.SITUATION]: situationOtherAdress,
  };
};
