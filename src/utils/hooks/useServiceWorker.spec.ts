import { renderHook, act } from '@testing-library/react';
import { useServiceWorker } from './useServiceWorker';
import * as serviceWorker from '../../serviceWorkerRegistration';
import { describe, expect, it, Mock, vi } from 'vitest';
import { beforeEach } from 'node:test';
const QUEEN_URL = 'http://example.com';

vi.mock('../../serviceWorkerRegistration');
vi.mock('./useConfiguration', () => {
  return {
    useConfiguration: () => {
      return {
        QUEEN_URL: 'http://example.com',
      };
    },
  };
});

describe('useServiceWorker', () => {
  beforeEach(() => {
    window.localStorage.clear();
    (serviceWorker.register as Mock).mockClear();
    (serviceWorker.unregister as Mock).mockClear();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useServiceWorker(true));

    expect(result.current.isUpdating).toBe(false);
    expect(result.current.isUpdateInstalled).toBeFalsy();
    expect(result.current.isInstallingServiceWorker).toBe(false);
    expect(result.current.isUpdateAvailable).toBe(false);
    expect(result.current.isServiceWorkerInstalled).toBe(false);
    expect(result.current.isInstallationFailed).toBe(false);
  });

  it('should register the service worker when authenticated and QUEEN_URL is provided', () => {
    renderHook(() => useServiceWorker(true));

    expect(serviceWorker.register).toHaveBeenCalledWith({
      QUEEN_URL,
      onInstalling: expect.any(Function),
      onUpdate: expect.any(Function),
      onWaiting: expect.any(Function),
      onSuccess: expect.any(Function),
      onError: expect.any(Function),
    });
  });

  it('should set isInstallingServiceWorker to true when installing', () => {
    const { result } = renderHook(() => useServiceWorker(true));

    act(() => {
      const onInstalling = (serviceWorker.register as Mock).mock.calls[0][0].onInstalling;
      onInstalling(true);
    });

    expect(result.current.isInstallingServiceWorker).toBe(true);
  });

  it('should set isServiceWorkerInstalled to true on successful registration', () => {
    const { result } = renderHook(() => useServiceWorker(true));

    act(() => {
      const onSuccess = (serviceWorker.register as Mock).mock.calls[0][0].onSuccess;
      onSuccess({});
    });

    expect(result.current.isServiceWorkerInstalled).toBe(true);
    expect(result.current.isInstallingServiceWorker).toBe(false);
  });

  it('should handle installation failure', () => {
    const { result } = renderHook(() => useServiceWorker(true));

    act(() => {
      const onError = (serviceWorker.register as Mock).mock.calls[0][0].onError;
      onError();
    });

    expect(result.current.isInstallationFailed).toBe(true);
  });

  it('should update the app when updateApp is called', () => {
    const { result } = renderHook(() => useServiceWorker(true));

    act(() => {
      result.current.updateApp();
    });

    expect(window.localStorage.getItem('installing-update')).toBe('true');
    expect(result.current.isUpdating).toBe(true);
  });

  it('should clear updating state when clearUpdating is called', () => {
    const { result } = renderHook(() => useServiceWorker(true));

    act(() => {
      result.current.clearUpdating();
    });

    expect(result.current.isUpdateInstalled).toBe(false);
    expect(window.localStorage.getItem('installing-update')).toBeNull();
  });

  it('should uninstall the service worker', () => {
    const { result } = renderHook(() => useServiceWorker(true));

    act(() => {
      result.current.uninstall();
    });

    expect(serviceWorker.unregister).toHaveBeenCalled();
  });
});
