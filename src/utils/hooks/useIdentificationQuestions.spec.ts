import { describe, it, expect, vi, Mock } from 'vitest';
import {
  IdentificationConfiguration,
  IdentificationQuestionsId,
} from 'utils/enum/identifications/IdentificationsQuestions';
import { SurveyUnit } from 'types/pearl';
import { surveyUnitStateEnum } from 'utils/enum/SUStateEnum';
import { addNewState, persistSurveyUnit } from 'utils/functions';
import { checkAvailability } from 'utils/functions/identifications/identificationFunctions';
import { useIdentificationQuestions } from './useIdentificationQuestions';
import { renderHook } from '@testing-library/react';
import { act } from 'react';

vi.mock('utils/functions', () => ({
  addNewState: vi.fn(),
  persistSurveyUnit: vi.fn(),
}));

vi.mock('utils/functions/identifications/identificationFunctions', () => ({
  checkAvailability: vi.fn(() => true),
  identificationIsFinished: vi.fn(() => true),
  identificationQuestionsTree: {
    CONFIG_A: {
      Q1: { id: 'Q1', options: [{ value: 'A', concluding: false }], nextId: 'Q2' },
      Q2: { id: 'Q2', options: [{ value: 'B', concluding: true }] },
    },
  },
}));

describe('useIdentification', () => {
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
      Q1: { value: 'A', concluding: false },
      Q2: undefined,
    });
    expect(result.current.selectedDialogId).toEqual('Q2');

    expect(persistSurveyUnit).toHaveBeenCalledWith(
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
      result.current.handleResponse('Q2' as IdentificationQuestionsId, {
        value: 'B',
        concluding: true,
        label: '',
      });
    });

    expect(persistSurveyUnit).toHaveBeenCalledWith(
      expect.objectContaining({
        states: expect.any(Array),
      })
    );

    expect(addNewState).toHaveBeenCalledWith(
      mockSurveyUnit,
      surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type
    );
  });

  it('resets availability for unavailable questions', () => {
    (checkAvailability as Mock).mockImplementationOnce((questions, question) => {
      return question.id !== 'Q2';
    });

    const { result } = renderHook(() => useIdentificationQuestions(mockSurveyUnit));

    act(() => {
      result.current.handleResponse('Q1' as IdentificationQuestionsId, {
        value: 'A',
        concluding: false,
        label: '',
      });
    });

    expect(result.current.availableQuestions).toEqual({
      Q1: true,
      Q2: false,
    });

    expect(result.current.responses).toEqual({
      Q1: { value: 'A', concluding: false },
      Q2: undefined,
    });
  });
});
