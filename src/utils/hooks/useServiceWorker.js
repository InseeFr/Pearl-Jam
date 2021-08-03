import { useContext, useEffect, useState } from 'react';
import { AppContext } from 'Root';
import * as serviceWorker from 'serviceWorkerRegistration';

const useServiceWorker = authenticated => {
  const configuration = useContext(AppContext);
  const [installingServiceWorker, setInstallingServiceWorker] = useState(false);
  const [waitingServiceWorker, setWaitingServiceWorker] = useState(null);
  const [isUpdateAvailable, setUpdateAvailable] = useState(false);
  const [isServiceWorkerInstalled, setServiceWorkerInstalled] = useState(false);

  useEffect(() => {
    const install = async () => {
      const { QUEEN_URL } = configuration;
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
  }, [authenticated, configuration]);

  return {
    installingServiceWorker,
    waitingServiceWorker,
    isUpdateAvailable,
    isServiceWorkerInstalled,
  };
};
export default useServiceWorker;
