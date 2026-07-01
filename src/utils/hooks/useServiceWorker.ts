import { useEffect, useState } from 'react';
import * as serviceWorker from '../../serviceWorkerRegistration';

const SW_UPDATE_KEY = 'installing-update';

export type ServiceWorkerState = {
  isUpdating: boolean;
  isUpdateInstalled: boolean;
  isInstallingServiceWorker: boolean;
  isUpdateAvailable: boolean;
  isServiceWorkerInstalled: boolean;
  isInstallationFailed: boolean;
  updateApp: VoidFunction;
  clearUpdating: VoidFunction;
  uninstall: VoidFunction;
};

/**
 * Resolve the state of the service worker
 */
export const useServiceWorker = (authenticated: boolean): ServiceWorkerState => {
  const QUEEN_URL = import.meta.env.VITE_QUEEN_URL;
  const [isInstallingServiceWorker, setIsInstallingServiceWorker] = useState(false);
  const [waitingServiceWorker, setWaitingServiceWorker] = useState<ServiceWorker | null>(null);
  const [isUpdateAvailable, setUpdateAvailable] = useState(false);
  const [isServiceWorkerInstalled, setServiceWorkerInstalled] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdateInstalled, setIsUpdateInstalled] = useState(
    globalThis.localStorage.getItem(SW_UPDATE_KEY) === 'true'
  );
  const [isInstallationFailed, setIsInstallationFailed] = useState(false);

  const uninstall = () => {
    serviceWorker.unregister({
      onUnregister: () => {},
    });
  };

  useEffect(() => {
    if (authenticated && QUEEN_URL) {
      serviceWorker.register({
        QUEEN_URL,
        onInstalling: (installing: boolean) => {
          setIsInstallingServiceWorker(installing);
        },
        onUpdate: (registration: ServiceWorkerRegistration) => {
          setWaitingServiceWorker(registration.waiting);
          setUpdateAvailable(true);
        },
        onWaiting: (waiting: ServiceWorker) => {
          setWaitingServiceWorker(waiting);
          setUpdateAvailable(true);
        },
        onSuccess: (registration: ServiceWorkerRegistration) => {
          setIsInstallingServiceWorker(false);
          setServiceWorkerInstalled(!!registration);
        },
        onError: () => {
          setIsInstallationFailed(true);
        },
      });
    }
  }, [QUEEN_URL, authenticated]);

  const updateAssets = () => {
    if (!waitingServiceWorker) {
      setIsInstallationFailed(true);
      return;
    }

    waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
  };

  const updateApp = () => {
    globalThis.localStorage.setItem(SW_UPDATE_KEY, 'true');
    setIsUpdating(true);
    updateAssets();
  };

  const clearUpdating = () => {
    setIsUpdateInstalled(false);
    globalThis.localStorage.removeItem(SW_UPDATE_KEY);
  };

  useEffect(() => {
    let refreshing = false;
    const reloadWhenControllerChanges = () => {
      if (!refreshing) {
        refreshing = true;
        globalThis.location.reload();
      }
    };

    navigator.serviceWorker?.addEventListener('controllerchange', reloadWhenControllerChanges);

    return () => {
      navigator.serviceWorker?.removeEventListener('controllerchange', reloadWhenControllerChanges);
    };
  }, []);

  useEffect(() => {
    if (!waitingServiceWorker) {
      return;
    }

    const reloadWhenActivated = (event: Event) => {
      if (event.target instanceof ServiceWorker && event.target.state === 'activated') {
        globalThis.location.reload();
      }
    };

    waitingServiceWorker.addEventListener('statechange', reloadWhenActivated);

    return () => {
      waitingServiceWorker.removeEventListener('statechange', reloadWhenActivated);
    };
  }, [waitingServiceWorker]);

  return {
    isUpdating,
    isUpdateInstalled,
    isInstallingServiceWorker,
    isUpdateAvailable,
    isServiceWorkerInstalled,
    isInstallationFailed,
    updateApp,
    clearUpdating,
    uninstall,
  };
};
