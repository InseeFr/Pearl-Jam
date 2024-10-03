import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useNetworkOnline } from './useOnline';

// Simuler les événements 'online' et 'offline'
const mockOnline = () => window.dispatchEvent(new Event('online'));
const mockOffline = () => window.dispatchEvent(new Event('offline'));

describe('useNetworkOnline', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('should return initial online status', () => {
    const { result } = renderHook(() => useNetworkOnline());
    expect(result.current).toBe(navigator.onLine);
  });

  test('should update status when network comes online', () => {
    const { result } = renderHook(() => useNetworkOnline());
    act(() => {
      mockOnline();
    });
    expect(result.current).toBe(true);
  });

  test('should update status when network goes offline', () => {
    const { result } = renderHook(() => useNetworkOnline());
    act(() => {
      mockOffline();
    });
    expect(result.current).toBe(false);
  });

  test('should clean up event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useNetworkOnline());
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(2);
  });
});
