import { useEffect, useState } from 'react';
import * as serviceWorker from 'serviceWorkerRegistration';

const useServiceWorker = authenticated => {
  const [installingServiceWorker, setInstallingServiceWorker] = useState(false);
  const [waitingServiceWorker, setWaitingServiceWorker] = useState(null);
  const [isUpdateAvailable, setUpdateAvailable] = useState(false);
  const [isServiceWorkerInstalled, setServiceWorkerInstalled] = useState(false);

  useEffect(() => {
    const install = async () => {
      const configuration = await fetch(`${window.location.origin}/configuration.json`);
      const { QUEEN_URL } = await configuration.json();
      serviceWorker.register({
        QUEEN_URL,
        onInstalling: installing => {
          setInstallingServiceWorker(installing);
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
          setInstallingServiceWorker(false);
          setServiceWorkerInstalled(!!registration);
        },
      });
    };
    if (authenticated) install();
  }, [authenticated]);

  return {
    installingServiceWorker,
    waitingServiceWorker,
    isUpdateAvailable,
    isServiceWorkerInstalled,
  };
};
export default useServiceWorker;
