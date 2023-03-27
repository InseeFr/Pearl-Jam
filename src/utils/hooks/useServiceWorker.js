import { useState, useEffect, useContext } from 'react';
import { AppContext } from 'Root';
import * as serviceWorker from 'serviceWorkerRegistration';

const SW_UPDATE_KEY = 'installing-update';

export const useServiceWorker = authenticated => {
  const { QUEEN_URL } = useContext(AppContext);
  const [isInstallingServiceWorker, setIsInstallingServiceWorker] = useState(false);
  const [waitingServiceWorker, setWaitingServiceWorker] = useState(null);
  const [isUpdateAvailable, setUpdateAvailable] = useState(false);
  const [isServiceWorkerInstalled, setServiceWorkerInstalled] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdateInstalled, setIsUpdateInstalled] = useState(
    window.localStorage.getItem(SW_UPDATE_KEY)
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
        onInstalling: installing => {
          setIsInstallingServiceWorker(installing);
        },
        onUpdate: registration => {
          setWaitingServiceWorker(registration.waiting);
          setUpdateAvailable(true);
        },
        onWaiting: waiting => {
          setWaitingServiceWorker(waiting);
          setUpdateAvailable(true);
        },
        onSuccess: registration => {
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
    window.localStorage.setItem(SW_UPDATE_KEY, true);
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
        if (event.target.state === 'activated') {
          window.location.reload();
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
