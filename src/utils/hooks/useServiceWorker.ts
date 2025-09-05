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
    window.localStorage.getItem(SW_UPDATE_KEY) === 'true'
  );
  const [isInstallationFailed, setIsInstallationFailed] = useState(false);

  const uninstall = () => {
    serviceWorker.unregister({
      onUnregister: () => {},
    });
  };

  useEffect(() => {
    console.log('Queen url', QUEEN_URL);

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
    if (waitingServiceWorker) {
      waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  const updateApp = () => {
    window.localStorage.setItem(SW_UPDATE_KEY, 'true');
    setIsUpdating(true);
    updateAssets();
  };

  const clearUpdating = () => {
    setIsUpdateInstalled(false);
    window.localStorage.removeItem(SW_UPDATE_KEY);
  };

  useEffect(() => {
    if (waitingServiceWorker) {
      waitingServiceWorker.addEventListener('statechange', event => {
        if (event.target instanceof ServiceWorker) {
          if (event.target.state === 'activated') {
            window.location.reload();
          }
        }
      });
    }
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
