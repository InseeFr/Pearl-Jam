import {
  IdentificationQuestionOptionValues,
  IdentificationQuestionsId,
} from 'utils/enum/identifications/IdentificationsQuestions';
import {
  IdentificationQuestions,
  IdentificationQuestionValue,
  TransmissionRules,
} from '../identificationFunctions';
import D from 'i18n';
import { optionsMap } from './optionsMap';
import { SurveyUnitIdentification } from 'types/pearl';

const numberOfRespondents: IdentificationQuestionValue = {
  id: IdentificationQuestionsId.NUMBER_OF_RESPONDENTS,
  nextId: IdentificationQuestionsId.INDIVIDUAL_STATUS,
  text: `${D.numberOfRespondents}`,
  options: [
    { ...optionsMap.ONE, concluding: false },
    { ...optionsMap.MANY, concluding: false },
  ],
};

const individualStatus: IdentificationQuestionValue = {
  id: IdentificationQuestionsId.INDIVIDUAL_STATUS,
  nextId: IdentificationQuestionsId.HOUSEHOLD_COMPOSITION,
  text: `${D.foundIndividual}`,
  options: [
    { ...optionsMap.SAME_ADDRESS, concluding: true, label: D.sameHouse },
    { ...optionsMap.OTHER_ADDRESS, concluding: false, label: D.otherHouse },
    { ...optionsMap.NOFIELD, concluding: false },
    { ...optionsMap.NOIDENT, concluding: true },
    { ...optionsMap.DCD, concluding: true },
  ],
  dependsOn: {
    questionId: IdentificationQuestionsId.IDENTIFICATION,
    values: [IdentificationQuestionOptionValues.ONE, IdentificationQuestionOptionValues.MANY],
  },
};

const houseHoldComposition: IdentificationQuestionValue = {
  id: IdentificationQuestionsId.HOUSEHOLD_COMPOSITION,
  nextId: IdentificationQuestionsId.PRESENT_IN_PREVIOUS_HOME,
  text: `${D.houseHoldComposition}`,
  options: [
    { ...optionsMap.SAME_COMPO, concluding: false },
    { ...optionsMap.OTHER_COMPO, concluding: false },
  ],
  dependsOn: {
    questionId: IdentificationQuestionsId.INDIVIDUAL_STATUS,
    values: [
      IdentificationQuestionOptionValues.NOFIELD,
      IdentificationQuestionOptionValues.OTHER_ADDRESS,
    ],
  },
};

const presentInPreviousHome: IdentificationQuestionValue = {
  id: IdentificationQuestionsId.PRESENT_IN_PREVIOUS_HOME,
  nextId: IdentificationQuestionsId.SITUATION,
  text: `${D.presentInPreviousHome}`,
  options: [
    { ...optionsMap.NONE, concluding: false },
    { ...optionsMap.AT_LEAST_ONE, concluding: true },
  ],
  dependsOn: {
    questionId: IdentificationQuestionsId.HOUSEHOLD_COMPOSITION,
    values: [IdentificationQuestionOptionValues.OTHER_COMPO],
  },
};

const presentInPreviousHomeDisabled: IdentificationQuestionValue = {
  ...presentInPreviousHome,
  disabled: true,
};

const housingSituation: IdentificationQuestionValue = {
  id: IdentificationQuestionsId.SITUATION,
  text: `${D.housingSituation}`,
  options: [
    { ...optionsMap.ORDINARY, concluding: true },
    { ...optionsMap.NOORDINARY, concluding: true },
  ],
  dependsOn: {
    questionId: IdentificationQuestionsId.PRESENT_IN_PREVIOUS_HOME,
    values: [IdentificationQuestionOptionValues.NONE],
  },
};

export const SRCVIdentificationQuestionsTreeFunction = (
  identification?: SurveyUnitIdentification
): IdentificationQuestions => {
  // return tree with one respondent
  if (identification?.numberOfRespondents === optionsMap.ONE.value) {
    return {
      root: IdentificationQuestionsId.NUMBER_OF_RESPONDENTS,
      [IdentificationQuestionsId.NUMBER_OF_RESPONDENTS]: numberOfRespondents,
      [IdentificationQuestionsId.INDIVIDUAL_STATUS]: {
        ...individualStatus,
        nextId: IdentificationQuestionsId.SITUATION,
        options: [
          { ...optionsMap.SAME_ADDRESS, concluding: true, label: D.sameHouse },
          { ...optionsMap.OTHER_ADDRESS, concluding: false, label: D.otherHouse },
          { ...optionsMap.NOFIELD, concluding: true },
          { ...optionsMap.NOIDENT, concluding: true },
          { ...optionsMap.DCD, concluding: true },
        ],
      },
      [IdentificationQuestionsId.HOUSEHOLD_COMPOSITION]: {
        ...houseHoldComposition,
        disabled: true,
      },
      [IdentificationQuestionsId.PRESENT_IN_PREVIOUS_HOME]: presentInPreviousHomeDisabled,
      [IdentificationQuestionsId.SITUATION]: {
        ...housingSituation,
        dependsOn: {
          questionId: IdentificationQuestionsId.INDIVIDUAL_STATUS,
          values: [IdentificationQuestionOptionValues.OTHER_ADDRESS],
        },
      },
    };
  }

  // return tree with several respondents and NOFIELD
  if (
    identification?.numberOfRespondents === optionsMap.MANY.value &&
    identification?.individualStatus === optionsMap.NOFIELD.value
  ) {
    return {
      root: IdentificationQuestionsId.NUMBER_OF_RESPONDENTS,
      [IdentificationQuestionsId.NUMBER_OF_RESPONDENTS]: numberOfRespondents,
      [IdentificationQuestionsId.INDIVIDUAL_STATUS]: individualStatus,
      [IdentificationQuestionsId.HOUSEHOLD_COMPOSITION]: {
        ...houseHoldComposition,
        options: [
          { ...optionsMap.SAME_COMPO, concluding: true },
          { ...optionsMap.OTHER_COMPO, concluding: true },
        ],
      },
      [IdentificationQuestionsId.PRESENT_IN_PREVIOUS_HOME]: presentInPreviousHomeDisabled,
      [IdentificationQuestionsId.SITUATION]: {
        ...housingSituation,
        disabled: true,
      },
    };
  }

  // return tree with several respondents (MANY -> OTHER ADRESS -> SAMECOMPO)
  if (
    identification?.numberOfRespondents === optionsMap.MANY.value &&
    identification?.householdComposition === optionsMap.SAME_COMPO.value
  ) {
    return {
      root: IdentificationQuestionsId.NUMBER_OF_RESPONDENTS,
      [IdentificationQuestionsId.NUMBER_OF_RESPONDENTS]: numberOfRespondents,
      [IdentificationQuestionsId.INDIVIDUAL_STATUS]: individualStatus,
      [IdentificationQuestionsId.HOUSEHOLD_COMPOSITION]: {
        ...houseHoldComposition,
        nextId: IdentificationQuestionsId.SITUATION,
      },
      [IdentificationQuestionsId.PRESENT_IN_PREVIOUS_HOME]: presentInPreviousHomeDisabled,
      [IdentificationQuestionsId.SITUATION]: {
        ...housingSituation,
        dependsOn: {
          questionId: IdentificationQuestionsId.HOUSEHOLD_COMPOSITION,
          values: [IdentificationQuestionOptionValues.SAME_COMPO],
        },
      },
    };
  }

  // return default tree
  return {
    root: IdentificationQuestionsId.NUMBER_OF_RESPONDENTS,
    [IdentificationQuestionsId.NUMBER_OF_RESPONDENTS]: numberOfRespondents,
    [IdentificationQuestionsId.INDIVIDUAL_STATUS]: individualStatus,
    [IdentificationQuestionsId.HOUSEHOLD_COMPOSITION]: houseHoldComposition,
    [IdentificationQuestionsId.PRESENT_IN_PREVIOUS_HOME]: presentInPreviousHome,
    [IdentificationQuestionsId.SITUATION]: housingSituation,
  };
};

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
