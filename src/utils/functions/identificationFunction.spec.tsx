import { identificationConfigurationEnum as mockConfigurationEnum } from 'utils/enum/IdentificationConfigurationEnum';
import { describe, expect, it, vi } from 'vitest';
import {
  formatToSave,
  IASCO_IDENTIFICATION_FINISHING_VALUES,
  IASCO_SITUATION_FINISHING_VALUES,
  identificationIsFinished,
} from './identificationFunctions';
import {
  identificationAnswersEnum,
  identificationAnswerTypeEnum,
  Question,
} from 'utils/enum/IdentificationAnswersEnum';
import { Identification } from 'types/IdentificationConfiguration';

vi.mock('utils/enum/IdentificationAnswersEnum', () => ({
  identificationAnswersEnum: {
    IDENTIFICATION: { questionType: 'IDENTIFICATION', value: 'idValue', concluding: true },
    ACCESS: { questionType: 'ACCESS', value: 'accessValue', concluding: false },
    SITUATION: { questionType: 'SITUATION', value: 'situationValue', concluding: true },
    CATEGORY: { questionType: 'CATEGORY', value: 'categoryValue', concluding: false },
    OCCUPANT: { questionType: 'OCCUPANT', value: 'occupantValue', concluding: true },
  },
  identificationAnswerTypeEnum: {
    IDENTIFICATION: 'IDENTIFICATION',
    ACCESS: 'ACCESS',
    SITUATION: 'SITUATION',
    CATEGORY: 'CATEGORY',
    OCCUPANT: 'OCCUPANT',
  },
}));

vi.mock('utils/enum/IdentificationConfigurationEnum', () => ({
  identificationConfigurationEnum: {
    IASCO: 'IASCO',
    NOIDENT: 'NOIDENT',
  },
}));

describe('formatToSave', () => {
  it('should correctly format data for saving', () => {
    const mockData = [
      {
        selectedAnswer: {
          questionType: identificationAnswerTypeEnum.IDENTIFICATION,
          value: 'idValue',
        },
      },
      {
        selectedAnswer: { questionType: identificationAnswerTypeEnum.ACCESS, value: 'accessValue' },
      },
      {
        selectedAnswer: {
          questionType: identificationAnswerTypeEnum.SITUATION,
          value: 'situationValue',
        },
      },
      {
        selectedAnswer: {
          questionType: identificationAnswerTypeEnum.CATEGORY,
          value: 'categoryValue',
        },
      },
      {
        selectedAnswer: {
          questionType: identificationAnswerTypeEnum.OCCUPANT,
          value: 'occupantValue',
        },
      },
    ] as { selectedAnswer: Question }[];

    const result = formatToSave(mockData);

    expect(result).toEqual({
      identification: 'idValue',
      access: 'accessValue',
      situation: 'situationValue',
      category: 'categoryValue',
      occupant: 'occupantValue',
    });
  });
});

describe('IASCO_FINISHING_VALUES', () => {
  it('should correctly populate IASCO_IDENTIFICATION_FINISHING_VALUES', () => {
    expect(IASCO_IDENTIFICATION_FINISHING_VALUES).toEqual(['idValue']);
  });

  it('should correctly populate IASCO_SITUATION_FINISHING_VALUES', () => {
    expect(IASCO_SITUATION_FINISHING_VALUES).toEqual(['situationValue']);
  });
});

describe('identificationIsFinished', () => {
  it('should return true for a valid IASCO identification', () => {
    const mockIdentification = {
      identification: 'idValue',
      access: 'accessValue',
      situation: 'situationValue',
      category: 'categoryValue',
      occupant: 'occupantValue',
    };

    const result = identificationIsFinished(mockConfigurationEnum.IASCO, mockIdentification);

    expect(result).toBe(true);
  });

  it('should return false for an invalid IASCO identification', () => {
    const mockIdentification = {
      identification: undefined,
      access: undefined,
      situation: undefined,
      category: undefined,
      occupant: undefined,
    };

    const result = identificationIsFinished(
      mockConfigurationEnum.IASCO,
      mockIdentification as unknown as Identification
    );

    expect(result).toBe(false);
  });

  it('should return true for NOIDENT configuration regardless of input', () => {
    const mockIdentification = {};

    const result = identificationIsFinished(
      mockConfigurationEnum.NOIDENT,
      mockIdentification as unknown as Identification
    );

    expect(result).toBe(true);
  });
});
