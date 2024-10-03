import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useQueenListener } from './useQueenListener';
import surveyUnitDBService from 'utils/indexeddb/services/surveyUnit-idb-service';
import { persistSurveyUnit } from '../functions';

vi.mock('utils/indexeddb/services/surveyUnit-idb-service');
vi.mock('../functions');

describe('useQueenListener', () => {
  const mockRedirect = vi.fn();
  let addEventListenerSpy;
  let removeEventListenerSpy;

  beforeEach(() => {
    addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should add and remove event listener correctly', () => {
    const { unmount } = renderHook(() => useQueenListener(mockRedirect));

    expect(addEventListenerSpy).toHaveBeenCalledWith('QUEEN', expect.any(Function));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('QUEEN', expect.any(Function));
  });

  it('should handle CLOSE_QUEEN event correctly', () => {
    renderHook(() => useQueenListener(mockRedirect));

    window.dispatchEvent(
      new CustomEvent('QUEEN', {
        detail: { type: 'QUEEN', command: 'CLOSE_QUEEN', surveyUnit: '123' },
      })
    );

    expect(mockRedirect).toHaveBeenCalledWith('/survey-unit/123/details');
  });

  it('should handle UPDATE_SURVEY_UNIT event correctly', async () => {
    const mockSurveyUnit = { id: '123', states: [] };
    surveyUnitDBService.getById.mockResolvedValue(mockSurveyUnit);

    renderHook(() => useQueenListener(mockRedirect));

    await window.dispatchEvent(
      new CustomEvent('QUEEN', {
        detail: {
          type: 'QUEEN',
          command: 'UPDATE_SURVEY_UNIT',
          surveyUnit: '123',
          state: 'COMPLETED',
        },
      })
    );

    expect(surveyUnitDBService.getById).toHaveBeenCalledWith('123');
    expect(persistSurveyUnit).toHaveBeenCalled();
  });

  it('should return true for HEALTH_CHECK event', () => {
    renderHook(() => useQueenListener(mockRedirect));

    const result = window.dispatchEvent(
      new CustomEvent('QUEEN', {
        detail: { type: 'QUEEN', command: 'HEALTH_CHECK' },
      })
    );

    expect(result).toBe(true);
  });
});
