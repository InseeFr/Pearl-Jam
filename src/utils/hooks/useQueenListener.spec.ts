import { renderHook } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { useQueenListener } from './useQueenListener';
import { surveyUnitIDBService } from 'utils/indexeddb/services/surveyUnit-idb-service';
import * as Functions from '../functions';

describe('useQueenListener', () => {
  it('should call redirect with correct URL for CLOSE_QUEEN', () => {
    const mockRedirect = vi.fn();
    const surveyUnitID = 'SU123';

    renderHook(() => useQueenListener(mockRedirect));

    const event = new CustomEvent('QUEEN', {
      detail: {
        type: 'QUEEN',
        command: 'CLOSE_QUEEN',
        surveyUnit: surveyUnitID,
        state: 'COMPLETED',
      },
    });

    window.dispatchEvent(event);

    expect(mockRedirect).toHaveBeenCalledWith(`/survey-unit/${surveyUnitID}/details`);
  });

  it('should update survey unit for UPDATE_SURVEY_UNIT', async () => {
    const mockRedirect = vi.fn();
    const surveyUnitID = 'SU123';
    const mockGetById = vi.spyOn(surveyUnitIDBService, 'getById').mockResolvedValue({
      id: surveyUnitID,
      states: [],
    });
    const mockPersistSurveyUnit = vi
      .spyOn(Functions, 'persistSurveyUnit')
      .mockImplementation(vi.fn());

    renderHook(() => useQueenListener(mockRedirect));

    const event = new CustomEvent('QUEEN', {
      detail: {
        type: 'QUEEN',
        command: 'UPDATE_SURVEY_UNIT',
        surveyUnit: surveyUnitID,
        state: 'COMPLETED',
      },
    });

    window.dispatchEvent(event);

    await new Promise(process.nextTick);

    expect(mockGetById).toHaveBeenCalledWith(surveyUnitID);
    expect(mockPersistSurveyUnit).toHaveBeenCalled();

    mockGetById.mockRestore();
    mockPersistSurveyUnit.mockRestore();
  });

  it('should add and remove QUEEN event listener on mount and unmount', () => {
    const mockRedirect = vi.fn();
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useQueenListener(mockRedirect));

    expect(addEventListenerSpy).toHaveBeenCalledWith('QUEEN', expect.any(Function));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('QUEEN', expect.any(Function));

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });
});
