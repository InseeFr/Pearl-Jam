import {
  IdentificationQuestionOptionValues,
  IdentificationQuestionsId,
} from 'utils/enum/identifications/IdentificationsQuestions';
import { TransmissionRules } from '../identificationFunctions';
import D from 'i18n';
import { optionsMap } from './optionsMap';
import { SurveyUnitIdentification } from 'types/pearl';

const numberOfRespondents = {
  [IdentificationQuestionsId.NUMBER_OF_RESPONDENTS]: {
    id: IdentificationQuestionsId.NUMBER_OF_RESPONDENTS,
    nextId: IdentificationQuestionsId.INDIVIDUAL_STATUS,
    text: `${D.numberOfRespondents}`,
    options: [
      { ...optionsMap.ONE, concluding: false },
      { ...optionsMap.MANY, concluding: false },
    ],
  },
};

const individualStatus = {
  [IdentificationQuestionsId.INDIVIDUAL_STATUS]: {
    id: IdentificationQuestionsId.INDIVIDUAL_STATUS,
    nextId: IdentificationQuestionsId.HOUSEHOLD_COMPOSITION,
    text: `${D.foundIndividual}`,
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
};

const houseHoldComposition = {
  [IdentificationQuestionsId.HOUSEHOLD_COMPOSITION]: {
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
        IdentificationQuestionOptionValues.OTHER_HOUSE,
      ],
    },
  },
};

const presentInPreviousHome = {
  [IdentificationQuestionsId.PRESENT_IN_PREVIOUS_HOME]: {
    id: IdentificationQuestionsId.PRESENT_IN_PREVIOUS_HOME,
    nextId: IdentificationQuestionsId.SITUATION,
    text: `${D.presentInPreviousHome}`,
    options: [
      { ...optionsMap.NO_IN_OLD_HOUSE, concluding: false },
      { ...optionsMap.IN_OLD_HOUSE, concluding: true },
    ],
    dependsOn: {
      questionId: IdentificationQuestionsId.HOUSEHOLD_COMPOSITION,
      values: [IdentificationQuestionOptionValues.OTHER_COMPO],
    },
  },
};

const presentInPreviousHomeDisabled = {
  [IdentificationQuestionsId.PRESENT_IN_PREVIOUS_HOME]: {
    ...presentInPreviousHome[IdentificationQuestionsId.PRESENT_IN_PREVIOUS_HOME],
    disabled: true,
  },
}

const housingSituation = {
  [IdentificationQuestionsId.SITUATION]: {
    id: IdentificationQuestionsId.SITUATION,
    text: `${D.housingSituation}`,
    options: [
      { ...optionsMap.ORDINARY, concluding: true },
      { ...optionsMap.NOORDINARY, concluding: true },
    ],
    dependsOn: {
      questionId: IdentificationQuestionsId.PRESENT_IN_PREVIOUS_HOME,
      values: [IdentificationQuestionOptionValues.NO_IN_OLD_HOUSE],
    },
  },
};

export const SRCVIdentificationQuestionsTreeFunction = (
  identification?: SurveyUnitIdentification
) => {
  // return tree with one respondent
  if (identification?.numberOfRespondents === optionsMap.ONE.value) {
    return {
      ...numberOfRespondents,

      [IdentificationQuestionsId.INDIVIDUAL_STATUS]: {
        ...individualStatus[IdentificationQuestionsId.INDIVIDUAL_STATUS],
        nextId: IdentificationQuestionsId.SITUATION,
        options: [
          { ...optionsMap.SAME_HOUSE, concluding: true },
          { ...optionsMap.OTHER_HOUSE, concluding: false },
          { ...optionsMap.NOFIELD, concluding: true },
          { ...optionsMap.NOIDENT, concluding: true },
          { ...optionsMap.DCD, concluding: true },
        ],
      },

      [IdentificationQuestionsId.HOUSEHOLD_COMPOSITION]: {
        ...houseHoldComposition[IdentificationQuestionsId.HOUSEHOLD_COMPOSITION],
        disabled: true,
      },

      ...presentInPreviousHomeDisabled,

      [IdentificationQuestionsId.SITUATION]: {
        ...housingSituation[IdentificationQuestionsId.SITUATION],
        dependsOn: {
          questionId: IdentificationQuestionsId.INDIVIDUAL_STATUS,
          values: [IdentificationQuestionOptionValues.OTHER_HOUSE],
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
      ...numberOfRespondents,
      ...individualStatus,
      [IdentificationQuestionsId.HOUSEHOLD_COMPOSITION]: {
        ...houseHoldComposition[IdentificationQuestionsId.HOUSEHOLD_COMPOSITION],
        options: [
          { ...optionsMap.SAME_COMPO, concluding: true },
          { ...optionsMap.OTHER_COMPO, concluding: true },
        ],
      },

      ...presentInPreviousHomeDisabled,

      [IdentificationQuestionsId.SITUATION]: {
        ...housingSituation[IdentificationQuestionsId.SITUATION],
        disabled: true,
      },
    };
  }

  // return tree with several respondents (MANY -> OTHERHOUSE -> SAMECOMPO)
  if (
    identification?.numberOfRespondents === optionsMap.MANY.value &&
    identification?.householdComposition === optionsMap.SAME_COMPO.value
  ) {
    return {
      ...numberOfRespondents,
      ...individualStatus,

      [IdentificationQuestionsId.HOUSEHOLD_COMPOSITION]: {
        ...houseHoldComposition[IdentificationQuestionsId.HOUSEHOLD_COMPOSITION],
        nextId: IdentificationQuestionsId.SITUATION,
      },

      ...presentInPreviousHomeDisabled,

      [IdentificationQuestionsId.SITUATION]: {
        ...housingSituation[IdentificationQuestionsId.SITUATION],
        dependsOn: {
          questionId: IdentificationQuestionsId.HOUSEHOLD_COMPOSITION,
          values: [IdentificationQuestionOptionValues.SAME_COMPO],
        },
      },
    };
  }

  // return default tree
  return {
    ...numberOfRespondents,
    ...individualStatus,
    ...houseHoldComposition,
    ...presentInPreviousHome,
    ...housingSituation,
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
