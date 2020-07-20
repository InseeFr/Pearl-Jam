import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import D from 'i18n';
import './notification.scss';

const Notification = ({ serviceWorkerInfo }) => {
  const {
    installingServiceWorker,
    waitingServiceWorker,
    isUpdateAvailable,
    isServiceWorkerInstalled,
    openNotification,
  } = serviceWorkerInfo;

  const [open, setOpen] = useState(openNotification);

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
/* Notification.propTypes = {
  serviceWorkerInfo: PropTypes.shape({
    installingServiceWorker: PropTypes.shape({}).isRequired,
    waitingServiceWorker: PropTypes.shape({}).isRequired,
    isUpdateAvailable: PropTypes.shape({}).isRequired,
    isServiceWorkerInstalled: PropTypes.shape({}).isRequired,
  }).isRequired,
}; */
