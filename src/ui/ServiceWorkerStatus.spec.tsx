import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, beforeEach, expect, vi, Mock } from 'vitest';
import { ServiceWorkerStatus } from './ServiceWorkerStatus';
import { useServiceWorker } from '../utils/hooks/useServiceWorker';
import D from '../i18n/build-dictionary';

vi.mock('../utils/hooks/useServiceWorker');

describe('ServiceWorkerStatus', () => {
  beforeEach(() => {
    (useServiceWorker as Mock).mockReturnValue({
      isUpdating: false,
      isUpdateInstalled: false,
      isUpdateAvailable: false,
      isServiceWorkerInstalled: false,
      isInstallingServiceWorker: false,
      isInstallationFailed: false,
      clearUpdating: vi.fn(),
      updateApp: vi.fn(),
    });
  });

  it(`Display ${D.updating}`, () => {
    (useServiceWorker as Mock).mockReturnValueOnce({
      isServiceWorkerInstalled: false,
      isUpdateInstalled: false,
      isUpdateAvailable: false,
      isUpdating: true,
      isInstallingServiceWorker: false,
      isInstallationFailed: false,
      clearUpdating: vi.fn(),
      updateApp: vi.fn(),
    });

    render(<ServiceWorkerStatus authenticated={true} />);
    screen.getByText(D.updating);
    expect(screen.queryByText(D.updateNow)).toBeNull();
  });

  it(`Display ${D.updateInstalled}`, () => {
    (useServiceWorker as Mock).mockReturnValueOnce({
      isServiceWorkerInstalled: false,
      isUpdateInstalled: true,
      isUpdateAvailable: false,
      isUpdating: false,
      isInstallingServiceWorker: false,
      isInstallationFailed: false,
      clearUpdating: vi.fn(),
      updateApp: vi.fn(),
    });

    render(<ServiceWorkerStatus authenticated={true} />);
    screen.getByText(D.updateInstalled);
    expect(screen.queryByText(D.updateNow)).toBeNull();
  });

  it(`Display ${D.updateAvailable}`, () => {
    const updateApp = vi.fn();
    (useServiceWorker as Mock).mockReturnValueOnce({
      isServiceWorkerInstalled: false,
      isUpdateInstalled: false,
      isUpdateAvailable: true,
      isUpdating: false,
      isInstallingServiceWorker: false,
      isInstallationFailed: false,
      clearUpdating: vi.fn(),
      updateApp,
    });

    render(<ServiceWorkerStatus authenticated={true} />);
    screen.getByText(D.updateAvailable);
    const button = screen.getByText(D.updateNow);
    fireEvent.click(button);
    expect(updateApp).toHaveBeenCalled();
  });

  it(`Display ${D.appReadyOffline}`, () => {
    (useServiceWorker as Mock).mockReturnValueOnce({
      isServiceWorkerInstalled: true,
      isUpdateInstalled: false,
      isUpdateAvailable: false,
      isUpdating: false,
      isInstallingServiceWorker: false,
      isInstallationFailed: false,
      clearUpdating: vi.fn(),
      updateApp: vi.fn(),
    });

    render(<ServiceWorkerStatus authenticated={true} />);
    screen.getByText(D.appReadyOffline);
    expect(screen.queryByText(D.updateNow)).toBeNull();
  });

  it(`Display ${D.appInstalling}`, () => {
    (useServiceWorker as Mock).mockReturnValueOnce({
      isServiceWorkerInstalled: false,
      isUpdateInstalled: false,
      isUpdateAvailable: false,
      isUpdating: false,
      isInstallingServiceWorker: true,
      isInstallationFailed: false,
      clearUpdating: vi.fn(),
      updateApp: vi.fn(),
    });

    render(<ServiceWorkerStatus authenticated={true} />);
    screen.getByText(D.appInstalling);
    expect(screen.queryByText(D.updateNow)).toBeNull();
  });

  it(`Display ${D.installError}`, () => {
    (useServiceWorker as Mock).mockReturnValueOnce({
      isServiceWorkerInstalled: false,
      isUpdateInstalled: false,
      isUpdateAvailable: false,
      isUpdating: false,
      isInstallingServiceWorker: false,
      isInstallationFailed: true,
      clearUpdating: vi.fn(),
      updateApp: vi.fn(),
    });

    render(<ServiceWorkerStatus authenticated={true} />);
    screen.getByText(D.installError);
    expect(screen.queryByText(D.updateNow)).toBeNull();
  });

  it('should close the Snackbar', () => {
    (useServiceWorker as Mock).mockReturnValueOnce({
      isServiceWorkerInstalled: false,
      isUpdateInstalled: false,
      isUpdateAvailable: false,
      isUpdating: false,
      isInstallingServiceWorker: false,
      isInstallationFailed: true,
      clearUpdating: vi.fn(),
      updateApp: vi.fn(),
    });

    render(<ServiceWorkerStatus authenticated={true} />);
    screen.getByText(D.installError);

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    expect(screen.queryByText(D.installError)).toBeNull();
  });

  it('should close the Snackbar and call clearUpdating', () => {
    const clearUpdating = vi.fn();
    (useServiceWorker as Mock).mockReturnValueOnce({
      isServiceWorkerInstalled: false,
      isUpdateInstalled: true,
      isUpdateAvailable: false,
      isUpdating: false,
      isInstallingServiceWorker: false,
      isInstallationFailed: false,
      clearUpdating,
      updateApp: vi.fn(),
    });

    render(<ServiceWorkerStatus authenticated={true} />);
    screen.getByText(D.updateInstalled);

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    expect(screen.queryByText(D.updateInstalled)).toBeNull();
    expect(clearUpdating).toHaveBeenCalled();
  });
});
