import { describe, it, expect, vi, Mock } from 'vitest';
import {
  IdentificationConfiguration,
  IdentificationQuestionsId,
} from 'utils/enum/identifications/IdentificationsQuestions';
import { SurveyUnit } from 'types/pearl';
import * as surveyUnitFunctions from 'utils/functions';
import {
  checkAvailability,
  identificationIsFinished,
} from 'utils/functions/identifications/identificationFunctions';
import { useIdentificationQuestions } from './useIdentificationQuestions';
import { renderHook, act } from '@testing-library/react';
import { surveyUnitStateEnum } from 'utils/enum/SUStateEnum';

vi.mock('utils/functions', { spy: true });
vi.mock('utils/functions/identifications/identificationFunctions', async () => {
  return {
    checkAvailability: vi.fn(() => true),
    identificationIsFinished: vi.fn(() => false),
    identificationQuestionsTree: {
      CONFIG_A: {
        Q1: {
          id: 'Q1',
          options: [
            { value: 'A', concluding: false },
            { value: 'C', concluding: true },
          ],
          nextId: 'Q2',
        },
        Q2: {
          id: 'Q2',
          options: [{ value: 'B', concluding: true }],
          dependsOn: {
            questionId: 'Q1',
            values: ['A'],
          },
        },
      },
      CONFIG_B: {},
    },
  };
});

vi.mock('utils/enum/identifications/IdentificationsQuestions', () => ({
  IdentificationConfiguration: {
    CONFIG_A: 'CONFIG_A',
    CONFIG_B: 'CONFIG_B',
  },
}));

describe('useIdentificationQuestions', () => {
  const mockSurveyUnit: SurveyUnit = {
    identificationConfiguration: 'CONFIG_A' as IdentificationConfiguration,
    identification: {},
    states: [],
    displayName: '',
    id: '',
    persons: [],
    address: {
      l1: '',
      l2: '',
      l3: '',
      l4: '',
      l5: '',
      l6: '',
      l7: '',
      elevator: false,
      building: '',
      floor: '',
      door: '',
      staircase: '',
      cityPriorityDistrict: false,
    },
    priority: false,
    move: false,
    campaign: '',
    comments: [],
    sampleIdentifiers: {
      bs: 0,
      ec: '',
      le: 0,
      noi: 0,
      numfa: 0,
      rges: 0,
      ssech: 0,
      nolog: 0,
      nole: 0,
      autre: '',
      nograp: '',
    },
    contactAttempts: [],
    campaignLabel: '',
    managementStartDate: 0,
    interviewerStartDate: 0,
    identificationPhaseStartDate: 0,
    collectionStartDate: 0,
    collectionEndDate: 0,
    endDate: 0,
    contactOutcomeConfiguration: '',
    contactAttemptConfiguration: '',
    useLetterCommunication: false,
    communicationRequests: [],
    communicationTemplates: [],
  };
  it('initializes with correct responses and availability', () => {
    const { result } = renderHook(() => useIdentificationQuestions(mockSurveyUnit));

    expect(result.current.responses).toEqual({
      Q1: undefined,
      Q2: undefined,
    });

    expect(result.current.availableQuestions).toEqual({
      Q1: true,
      Q2: true,
    });

    expect(result.current.selectedDialogId).toBeUndefined();
  });

  it('handles response updates correctly', () => {
    const { result } = renderHook(() => useIdentificationQuestions(mockSurveyUnit));

    act(() => {
      result.current.handleResponse('Q1' as IdentificationQuestionsId, {
        value: 'A',
        concluding: false,
        label: '',
      });
    });

    expect(result.current.responses).toEqual({
      Q1: { value: 'A', label: '', concluding: false },
      Q2: undefined,
    });
    expect(result.current.selectedDialogId).toEqual('Q2');

    expect(surveyUnitFunctions.persistSurveyUnit).toHaveBeenCalledWith(
      expect.objectContaining({
        identification: { Q1: 'A' },
      })
    );
  });

  it('handles response updates correctly', () => {
    const { result } = renderHook(() => useIdentificationQuestions(mockSurveyUnit));

    act(() => {
      result.current.handleResponse('Q1' as IdentificationQuestionsId, {
        value: 'A',
        concluding: false,
        label: '',
      });
    });

    act(() => {
      result.current.handleResponse('Q2' as IdentificationQuestionsId, {
        value: 'B',
        concluding: true,
        label: '',
      });
    });

    act(() => {
      result.current.handleResponse('Q1' as IdentificationQuestionsId, {
        value: 'A',
        concluding: false,
        label: '',
      });
    });

    expect(result.current.responses).toEqual({
      Q1: { value: 'A', label: '', concluding: false },
      Q2: undefined,
    });

    expect(result.current.selectedDialogId).toEqual('Q2');

    expect(surveyUnitFunctions.persistSurveyUnit).toHaveBeenCalledWith(
      expect.objectContaining({
        identification: { Q1: 'A' },
      })
    );
  });

  it('updates states when all questions are answered', () => {
    const { result } = renderHook(() => useIdentificationQuestions(mockSurveyUnit));
    act(() => {
      result.current.handleResponse('Q1' as IdentificationQuestionsId, {
        value: 'A',
        concluding: false,
        label: '',
      });
      mockSurveyUnit.identification = { Q1: 'A' };
    });

    expect(surveyUnitFunctions.persistSurveyUnit).toHaveBeenLastCalledWith(mockSurveyUnit);

    (identificationIsFinished as Mock).mockImplementationOnce(() => {
      return true;
    });

    act(() => {
      result.current.handleResponse('Q2' as IdentificationQuestionsId, {
        value: 'B',
        concluding: true,
        label: '',
      });
      mockSurveyUnit.identification = { Q1: 'A', Q2: 'B' };
    });

    expect(result.current.responses).toEqual({
      Q1: { value: 'A', concluding: false, label: '' },
      Q2: { value: 'B', concluding: true, label: '' },
    });

    expect(surveyUnitFunctions.persistSurveyUnit).toHaveBeenLastCalledWith(
      expect.objectContaining({
        states: [
          {
            date: expect.any(Number),
            type: surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type,
          },
        ],
      })
    );
  });

  it('resets availability for unavailable questions', () => {
    mockSurveyUnit.identification = { Q1: 'A', Q2: 'B' };
    const { result } = renderHook(() => useIdentificationQuestions(mockSurveyUnit));

    (identificationIsFinished as Mock).mockImplementationOnce(() => {
      return true;
    });

    (checkAvailability as Mock).mockImplementation((questions, question, responses) => {
      return question.id !== 'Q2';
    });

    act(() => {
      result.current.handleResponse('Q1' as IdentificationQuestionsId, {
        value: 'C',
        concluding: true,
        label: '',
      });
    });

    expect(result.current.availableQuestions).toEqual({
      Q1: true,
      Q2: false,
    });

    expect(result.current.responses).toEqual({
      Q1: { value: 'C', label: '', concluding: true },
      Q2: undefined,
    });
  });
});
