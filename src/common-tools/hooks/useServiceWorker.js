import { useState } from 'react';
import * as serviceWorker from 'serviceWorker';

const useServiceWorker = () => {
  const [installingServiceWorker, setInstallingServiceWorker] = useState(false);
  const [waitingServiceWorker, setWaitingServiceWorker] = useState(null);
  const [isUpdateAvailable, setUpdateAvailable] = useState(false);
  const [isServiceWorkerInstalled, setServiceWorkerInstalled] = useState(false);

  const serviceWorkerInfo = {
    installingServiceWorker,
    waitingServiceWorker,
    isUpdateAvailable,
    isServiceWorkerInstalled,
  };

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
  install();

  return {
    serviceWorkerInfo,
  };
};
export default useServiceWorker;
