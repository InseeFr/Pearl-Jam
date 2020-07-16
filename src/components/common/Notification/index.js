import React, { useState, useEffect } from 'react';
import D from 'i18n';
import * as serviceWorker from 'serviceWorker';
import './notification.scss';

const Notification = ({ setQueenSwState, queenSwState }) => {
  const [init, setInit] = useState(queenSwState);
  const [open, setOpen] = useState(false);
  const [installingServiceWorker, setInstallingServiceWorker] = useState(false);
  const [waitingServiceWorker, setWaitingServiceWorker] = useState(null);
  const [isUpdateAvailable, setUpdateAvailable] = useState(false);
  const [isServiceWorkerInstalled, setServiceWorkerInstalled] = useState(false);

  useEffect(() => {
    console.log('init value : ', init);
    if (!init) {
      const install = async () => {
        const configuration = await fetch(`${window.location.origin}/configuration.json`);
        const { QUEEN_URL } = await configuration.json();
        serviceWorker.register({
          QUEEN_URL,
          onInstalling: installing => {
            setInstallingServiceWorker(installing);
            setOpen(true);
          },
          onUpdate: registration => {
            setWaitingServiceWorker(registration.waiting);
            setUpdateAvailable(true);
            setOpen(true);
          },
          onWaiting: waiting => {
            setWaitingServiceWorker(waiting);
            setUpdateAvailable(true);
            setOpen(true);
          },
          onSuccess: registration => {
            setInstallingServiceWorker(false);
            setServiceWorkerInstalled(!!registration);
            setOpen(true);
          },
        });
        setQueenSwState(true);
        setInit(true);
      };
      install();
    }
  }, [init, setQueenSwState]);

  const updateAssets = () => {
    if (waitingServiceWorker) {
      waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
    }
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

  const getMessage = () => {
    if (isUpdateAvailable) return D.updateAvailable;
    if (isServiceWorkerInstalled) return D.appReadyOffline;
    if (installingServiceWorker) return D.appInstalling;
    return '';
  };

  return (
    <>
      <div
        className={`notification ${isUpdateAvailable ? 'update' : ''} ${
          (isUpdateAvailable || isServiceWorkerInstalled || installingServiceWorker) && open
            ? 'visible'
            : ''
        }`}
      >
        {open && (
          <>
            <button type="button" className="close-button" onClick={() => setOpen(false)}>
              {`\u2573 ${D.closeButton}`}
            </button>
            <div className="title">{getMessage()}</div>
            {isUpdateAvailable && (
              <button type="button" className="update-button" onClick={updateAssets}>
                {D.updateNow}
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Notification;
