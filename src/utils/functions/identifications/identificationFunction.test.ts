import { describe, it, expect } from 'vitest';
import { checkAvailability, IdentificationQuestions } from './identificationFunctions';
import { IdentificationQuestionsId } from 'utils/enum/identifications/IdentificationsQuestions';

// Mock data for testing
const mockQuestions: IdentificationQuestions = {
  [IdentificationQuestionsId.PERSON]: {
    id: IdentificationQuestionsId.PERSON,
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
      questionId: IdentificationQuestionsId.PERSON,
      values: ['YES'],
    },
  },
};

describe('checkAvailability', () => {
  it('should return true if there are no responses', () => {
    const result = checkAvailability(
      mockQuestions,
      mockQuestions[IdentificationQuestionsId.PERSON]
    );
    expect(result).toBe(true);
  });

  it('should return true if the question has no dependencies', () => {
    const result = checkAvailability(
      mockQuestions,
      mockQuestions[IdentificationQuestionsId.PERSON],
      {}
    );
    expect(result).toBe(true);
  });

  it('should return true if dependency values match', () => {
    const responses = {
      [IdentificationQuestionsId.PERSON]: { value: 'YES', label: 'Yes', concluding: false },
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
      [IdentificationQuestionsId.PERSON]: { value: 'NO', label: 'No', concluding: true },
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
      [IdentificationQuestionsId.PERSON]: { value: 'NO', label: 'No', concluding: true },
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
      [IdentificationQuestionsId.PERSON]: { value: 'YES', label: 'Yes', concluding: false },
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
      [IdentificationQuestionsId.PERSON]: { value: 'YES', label: 'Yes', concluding: false },
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
      [IdentificationQuestionsId.PERSON]: { value: 'NO', label: 'No', concluding: true },
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
