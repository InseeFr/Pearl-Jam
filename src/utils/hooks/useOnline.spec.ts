import { renderHook, act } from '@testing-library/react';
import { useNetworkOnline } from './useOnline';
import { describe, it, expect, beforeAll, beforeEach, afterEach } from 'vitest';

describe('useNetworkOnline', () => {
  let originalNavigator: Navigator;

  beforeAll(() => {
    originalNavigator = navigator;
  });

  beforeEach(() => {
    const mockNavigator = {
      ...originalNavigator,
      onLine: true,
    };
    global.navigator = mockNavigator;
  });

  afterEach(() => {
    global.navigator = originalNavigator;
  });

  it('should return true when online', () => {
    const { result } = renderHook(() => useNetworkOnline());

    expect(result.current).toBe(true);
  });

  it('should return false when offline', () => {
    (navigator as any).onLine = false;
    const { result } = renderHook(() => useNetworkOnline());

    expect(result.current).toBe(false);
  });

  it('should update state on online event', () => {
    (navigator as any).onLine = false;
    const { result } = renderHook(() => useNetworkOnline());

    act(() => {
      window.dispatchEvent(new Event('online'));
    });

    expect(result.current).toBe(true);
  });

  it('should update state on offline event', () => {
    (navigator as any).onLine = true;
    const { result } = renderHook(() => useNetworkOnline());

    act(() => {
      window.dispatchEvent(new Event('offline'));
    });

    expect(result.current).toBe(false);
  });
});
