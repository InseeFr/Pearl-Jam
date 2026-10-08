import { renderHook, act } from '@testing-library/react';
import { useNetworkOnline } from './useOnline';
import { describe, it, expect, beforeAll, beforeEach, afterEach } from 'vitest';

describe('useNetworkOnline', () => {
  beforeEach(() => {
    vi.stubGlobal('navigator', { onLine: true });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should return true when online', () => {
    const { result } = renderHook(() => useNetworkOnline());

    expect(result.current).toBe(true);
  });

  it('should return false when offline', () => {
    vi.stubGlobal('navigator', { onLine: false });
    const { result } = renderHook(() => useNetworkOnline());

    expect(result.current).toBe(false);
  });

  it('should update state on online event', () => {
    vi.stubGlobal('navigator', { onLine: false });
    const { result } = renderHook(() => useNetworkOnline());

    act(() => {
      globalThis.dispatchEvent(new Event('online'));
    });

    expect(result.current).toBe(true);
  });

  it('should update state on offline event', () => {
    vi.stubGlobal('navigator', { onLine: true });
    const { result } = renderHook(() => useNetworkOnline());

    act(() => {
      globalThis.dispatchEvent(new Event('offline'));
    });

    expect(result.current).toBe(false);
  });
});
