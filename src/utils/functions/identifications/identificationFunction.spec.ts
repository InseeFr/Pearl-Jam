import { describe, it, expect } from 'vitest';
import {
  checkAvailability,
  identificationIsFinished,
  IdentificationQuestions,
  isInvalidIdentificationAndContactOutcome,
  TransmissionRules,
  validateTransmission,
} from './identificationFunctions';
import {
  IdentificationConfiguration,
  IdentificationQuestionOptionValues,
  IdentificationQuestionsId,
} from 'utils/enum/identifications/IdentificationsQuestions';
import { SurveyUnit } from 'types/pearl';
import { contactOutcomeEnum } from 'utils/enum/ContactOutcomeEnum';

const mockQuestions: IdentificationQuestions = {
  [IdentificationQuestionsId.INDIVIDUAL_STATUS]: {
    id: IdentificationQuestionsId.INDIVIDUAL_STATUS,
    text: 'Person Question',
    options: [
      { value: 'YES', label: 'Yes', concluding: false },
      { value: 'NO', label: 'No', concluding: true },
    ],
  },
  [IdentificationQuestionsId.SITUATION]: {
    id: IdentificationQuestionsId.SITUATION,
    text: 'Situation Question',
    options: [
      { value: 'ACTIVE', label: 'Active', concluding: false },
      { value: 'INACTIVE', label: 'Inactive', concluding: true },
    ],
    dependsOn: {
      questionId: IdentificationQuestionsId.INDIVIDUAL_STATUS,
      values: ['YES'],
    },
  },
};

describe('checkAvailability', () => {
  it('should return true if there are no responses', () => {
    const result = checkAvailability(
      mockQuestions,
      mockQuestions[IdentificationQuestionsId.INDIVIDUAL_STATUS]
    );
    expect(result).toBe(true);
  });

  it('should return true if the question has no dependencies', () => {
    const result = checkAvailability(
      mockQuestions,
      mockQuestions[IdentificationQuestionsId.INDIVIDUAL_STATUS],
      {}
    );
    expect(result).toBe(true);
  });

  it('should return true if dependency values match', () => {
    const responses = {
      [IdentificationQuestionsId.INDIVIDUAL_STATUS]: {
        value: 'YES',
        label: 'Yes',
        concluding: false,
      },
    };
    const result = checkAvailability(
      mockQuestions,
      mockQuestions[IdentificationQuestionsId.SITUATION],
      responses
    );
    expect(result).toBe(true);
  });

  it('should return false if dependency values do not match', () => {
    const responses = {
      [IdentificationQuestionsId.INDIVIDUAL_STATUS]: { value: 'NO', label: 'No', concluding: true },
    };
    const result = checkAvailability(
      mockQuestions,
      mockQuestions[IdentificationQuestionsId.SITUATION],
      responses
    );
    expect(result).toBe(false);
  });

  it('should return false if the dependency question is concluding', () => {
    const responses = {
      [IdentificationQuestionsId.INDIVIDUAL_STATUS]: { value: 'NO', label: 'No', concluding: true },
    };
    const result = checkAvailability(
      mockQuestions,
      mockQuestions[IdentificationQuestionsId.SITUATION],
      responses
    );
    expect(result).toBe(false);
  });

  it('should return true if parent question is available and non-concluding', () => {
    const responses = {
      [IdentificationQuestionsId.INDIVIDUAL_STATUS]: {
        value: 'YES',
        label: 'Yes',
        concluding: false,
      },
    };
    const result = checkAvailability(
      mockQuestions,
      mockQuestions[IdentificationQuestionsId.SITUATION],
      responses
    );
    expect(result).toBe(true);
  });

  it('should handle cases with multiple levels of dependencies', () => {
    const extendedQuestions: IdentificationQuestions = {
      ...mockQuestions,
      [IdentificationQuestionsId.CATEGORY]: {
        id: IdentificationQuestionsId.CATEGORY,
        text: 'Category Question',
        options: [
          { value: 'A', label: 'Category A', concluding: false },
          { value: 'B', label: 'Category B', concluding: true },
        ],
        dependsOn: {
          questionId: IdentificationQuestionsId.SITUATION,
          values: ['ACTIVE'],
        },
      },
    };

    const responses = {
      [IdentificationQuestionsId.INDIVIDUAL_STATUS]: {
        value: 'YES',
        label: 'Yes',
        concluding: false,
      },
      [IdentificationQuestionsId.SITUATION]: {
        value: 'ACTIVE',
        label: 'Active',
        concluding: false,
      },
    };

    const result = checkAvailability(
      extendedQuestions,
      extendedQuestions[IdentificationQuestionsId.CATEGORY],
      responses
    );
    expect(result).toBe(true);
  });

  it('should return false if a parent question dependency chain fails', () => {
    const extendedQuestions: IdentificationQuestions = {
      ...mockQuestions,
      [IdentificationQuestionsId.CATEGORY]: {
        id: IdentificationQuestionsId.CATEGORY,
        text: 'Category Question',
        options: [
          { value: 'A', label: 'Category A', concluding: false },
          { value: 'B', label: 'Category B', concluding: true },
        ],
        dependsOn: {
          questionId: IdentificationQuestionsId.SITUATION,
          values: ['ACTIVE'],
        },
      },
    };

    const responses = {
      [IdentificationQuestionsId.INDIVIDUAL_STATUS]: { value: 'NO', label: 'No', concluding: true },
      [IdentificationQuestionsId.SITUATION]: {
        value: 'INACTIVE',
        label: 'Inactive',
        concluding: true,
      },
    };

    const result = checkAvailability(
      extendedQuestions,
      extendedQuestions[IdentificationQuestionsId.CATEGORY],
      responses
    );
    expect(result).toBe(false);
  });
});

describe('identificationIsFinished', () => {
  it('should return false if identification is undefined', () => {
    const result = identificationIsFinished(IdentificationConfiguration.INDTEL);
    expect(result).toBe(false);
  });

  it('should return false if any question is not answered', () => {
    const identification = {
      [IdentificationQuestionsId.INDIVIDUAL_STATUS]: 'answer1',
      // Missing answer for QUESTION_2
    };
    const result = identificationIsFinished(IdentificationConfiguration.INDTEL, identification);
    expect(result).toBe(false);
  });

  it('should return true if all questions are answered', () => {
    const identification = {
      [IdentificationQuestionsId.INDIVIDUAL_STATUS]:
        IdentificationQuestionOptionValues.SAME_ADDRESS,
      [IdentificationQuestionsId.SITUATION]: IdentificationQuestionOptionValues.ORDINARY,
    };
    const result = identificationIsFinished(IdentificationConfiguration.INDTEL, identification);
    expect(result).toBe(true);
  });

  it('should return true if there are no questions in the configuration', () => {
    const result = identificationIsFinished(IdentificationConfiguration.NOIDENT, {});
    expect(result).toBe(true);
  });

  it('should return true one question is concluding', () => {
    const identification = {
      [IdentificationQuestionsId.INDIVIDUAL_STATUS]: IdentificationQuestionOptionValues.NOIDENT,
    };
    const result = identificationIsFinished(IdentificationConfiguration.INDTEL, identification);
    expect(result).toBe(true);
  });
});

describe('isInvalidIdentificationAndContactOutcome', () => {
  it('should return true if identification and contact outcome match the invalid rules', () => {
    const mockTransmissionRules: TransmissionRules = {
      invalidIdentificationsAndContactOutcome: {
        identifications: [
          {
            questionId: IdentificationQuestionsId.INDIVIDUAL_STATUS,
            value: IdentificationQuestionOptionValues.NOIDENT,
          },
        ],
        contactOutcome: contactOutcomeEnum.REFUSAL.value,
      },
    };

    const mockSurveyUnit: SurveyUnit = {
      identification: {
        [IdentificationQuestionsId.INDIVIDUAL_STATUS]: IdentificationQuestionOptionValues.NOIDENT,
      },
      contactOutcome: {
        date: Date.now(),
        totalNumberOfContactAttempts: 3,
        type: contactOutcomeEnum.REFUSAL.value,
      },
      // other SurveyUnit properties can be mocked as needed
    };

    const result = isInvalidIdentificationAndContactOutcome(mockTransmissionRules, mockSurveyUnit);
    expect(result).toBe(true);
  });

  it('should return false if identification does not match the invalid rules', () => {
    const mockTransmissionRules: TransmissionRules = {
      invalidIdentificationsAndContactOutcome: {
        identifications: [
          {
            questionId: IdentificationQuestionsId.INDIVIDUAL_STATUS,
            value: IdentificationQuestionOptionValues.NOIDENT,
          },
        ],
        contactOutcome: contactOutcomeEnum.REFUSAL.value,
      },
    };

    const mockSurveyUnit: SurveyUnit = {
      identification: {
        [IdentificationQuestionsId.INDIVIDUAL_STATUS]:
          IdentificationQuestionOptionValues.SAME_ADDRESS,
      },
      contactOutcome: {
        date: Date.now(),
        totalNumberOfContactAttempts: 2,
        type: contactOutcomeEnum.REFUSAL.value,
      },
    };

    const result = isInvalidIdentificationAndContactOutcome(mockTransmissionRules, mockSurveyUnit);
    expect(result).toBe(false);
  });

  it('should return false if contact outcome does not match the invalid rules', () => {
    const mockTransmissionRules: TransmissionRules = {
      invalidIdentificationsAndContactOutcome: {
        identifications: [
          {
            questionId: IdentificationQuestionsId.INDIVIDUAL_STATUS,
            value: IdentificationQuestionOptionValues.NOIDENT,
          },
        ],
        contactOutcome: contactOutcomeEnum.REFUSAL.value,
      },
    };

    const mockSurveyUnit: SurveyUnit = {
      identification: {
        [IdentificationQuestionsId.INDIVIDUAL_STATUS]: IdentificationQuestionOptionValues.NOIDENT,
      },
      contactOutcome: {
        date: Date.now(),
        totalNumberOfContactAttempts: 4,
        type: contactOutcomeEnum.INTERVIEW_ACCEPTED.value,
      },
    };

    const result = isInvalidIdentificationAndContactOutcome(mockTransmissionRules, mockSurveyUnit);
    expect(result).toBe(false);
  });
});

describe('validateTransmission', () => {
  it('should return false if identification is not finished but required', () => {
    const mockTransmissionRules: TransmissionRules = {
      validIfIdentificationFinished: true,
    };

    const mockSurveyUnit: SurveyUnit = {
      identificationConfiguration: IdentificationConfiguration.INDTEL,
      identification: {
        [IdentificationQuestionsId.INDIVIDUAL_STATUS]:
          IdentificationQuestionOptionValues.SAME_ADDRESS,
      },
      contactOutcome: {
        date: Date.now(),
        totalNumberOfContactAttempts: 1,
      },
    };

    const result = validateTransmission(mockTransmissionRules, mockSurveyUnit);
    expect(result).toBe(false);
  });

  it('should return false if contact outcome is missing but required', () => {
    const mockTransmissionRules: TransmissionRules = {
      invalidIfmissingContactOutcome: true,
    };

    const mockSurveyUnit: SurveyUnit = {
      identificationConfiguration: IdentificationConfiguration.INDTEL,
      identification: {
        [IdentificationQuestionsId.INDIVIDUAL_STATUS]:
          IdentificationQuestionOptionValues.SAME_ADDRESS,
      },
    };

    const result = validateTransmission(mockTransmissionRules, mockSurveyUnit);
    expect(result).toBe(false);
  });

  it('should return false if invalid identification and contact outcome combination exists', () => {
    const mockTransmissionRules: TransmissionRules = {
      invalidIdentificationsAndContactOutcome: {
        identifications: [
          {
            questionId: IdentificationQuestionsId.INDIVIDUAL_STATUS,
            value: IdentificationQuestionOptionValues.NOIDENT,
          },
        ],
        contactOutcome: contactOutcomeEnum.DECEASED.value,
      },
    };

    const mockSurveyUnit: SurveyUnit = {
      identification: {
        [IdentificationQuestionsId.INDIVIDUAL_STATUS]: IdentificationQuestionOptionValues.NOIDENT,
      },
      contactOutcome: {
        date: Date.now(),
        totalNumberOfContactAttempts: 5,
        type: contactOutcomeEnum.DECEASED.value,
      },
    };

    const result = validateTransmission(mockTransmissionRules, mockSurveyUnit);
    expect(result).toBe(false);
  });

  it('should return true for valid transmission scenarios', () => {
    const mockTransmissionRules: TransmissionRules = {
      validIfIdentificationFinished: true,
    };

    const mockSurveyUnit: SurveyUnit = {
      identificationConfiguration: IdentificationConfiguration.INDTEL,
      identification: {
        [IdentificationQuestionsId.INDIVIDUAL_STATUS]:
          IdentificationQuestionOptionValues.SAME_ADDRESS,
        [IdentificationQuestionsId.SITUATION]: IdentificationQuestionOptionValues.ORDINARY,
      },
      contactOutcome: {
        date: Date.now(),
        totalNumberOfContactAttempts: 2,
        type: contactOutcomeEnum.INTERVIEW_ACCEPTED.value,
      },
    };

    const result = validateTransmission(mockTransmissionRules, mockSurveyUnit);
    expect(result).toBe(true);
  });
});
