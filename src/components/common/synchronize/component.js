import React, { useState, useEffect /* useContext */ } from 'react';
import { useHistory } from 'react-router-dom';
import Modal from 'react-modal';
import { addOnlineStatusObserver } from 'common-tools/';
import { synchronizePearl, synchronizeQueen } from 'common-tools/synchronize';
import D from 'i18n';
import Loader from '../loader';
import './result.scss';

Modal.setAppElement('#root');

const Synchronize = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [syncResult, setSyncResult] = useState(undefined);
  const [pearlSync, setPearlSync] = useState(undefined);

  const [status, setStatus] = useState(navigator.onLine);

  useEffect(() => {
    addOnlineStatusObserver(s => {
      setStatus(s);
    });
  }, []);

  useEffect(() => {
    const pearlSynchResult = window.localStorage.getItem('PEARL_SYNC_RESULT');
    const queenSynchResult = window.localStorage.getItem('QUEEN_SYNC_RESULT');

    if (pearlSync) {
      if (pearlSync === 'FAILURE') {
        window.localStorage.removeItem('SYNCHRONIZE');
        setLoading(false);
        setSyncResult({ state: false, message: D.syncFailure });
      }
    } else if (pearlSynchResult !== null && queenSynchResult !== null) {
      window.localStorage.removeItem('SYNCHRONIZE');
      if (pearlSynchResult === 'SUCCESS' && queenSynchResult === 'SUCCESS') {
        setSyncResult({ state: true, message: D.syncSuccess });
      } else {
        setSyncResult({ state: false, message: D.syncFailure });
      }
    }
  }, [pearlSync, history]);

  const syncFunction = () => {
    window.localStorage.removeItem('PEARL_SYNC_RESULT');
    window.localStorage.removeItem('QUEEN_SYNC_RESULT');
    window.localStorage.setItem('SYNCHRONIZE', true);

    const launchSynchronize = async () => {
      try {
        setPearlSync(undefined);
        setLoading(true);

        await synchronizePearl()
          .catch(e => {
            console.log('error in synchronizePearl()');
            throw e;
          })
          .then(() => {
            console.log('synchronize success');
            setPearlSync('SUCCESS');
            window.localStorage.setItem('PEARL_SYNC_RESULT', 'SUCCESS');
          })
          .catch(e => {
            console.log('error during pearl Synchro');
            console.log(e);
            setPearlSync('FAILURE');
            throw e;
          })
          .then(async () => {
            console.log('Pearl synchronization : ENDED !');
            await synchronizeQueen(history);
          })
          .catch(e => {
            console.log('Error in Queen Synchro');
            console.log(e);
          });
      } catch (e) {
        console.log('synch failure');
        console.log(e);
      }
    };
    launchSynchronize();
  };

  const syncOnClick = () => {
    if (!loading && status) {
      syncFunction();
    } else {
      console.log('offline');
    }
  };

  const close = async () => {
    setSyncResult(undefined);
    window.localStorage.removeItem('PEARL_SYNC_RESULT');
  };

  return (
    <>
      {loading && <Loader message={D.synchronizationInProgress} />}
      {!loading && syncResult && (
        <Modal
          className={`sync-result ${syncResult.state ? 'success' : 'failure'}`}
          isOpen={!!syncResult}
          onRequestClose={close}
        >
          <button type="button" className="close-result" onClick={close}>
            ╳
          </button>
          <h2>{D.syncResult}</h2>
          <p>{syncResult.message}</p>
        </Modal>
      )}

      <div className={!status ? 'sync offline' : 'sync'}>
        <button type="button" disabled={!status} onClick={() => syncOnClick()}>
          <i
            alt="sync-logo"
            className={loading ? 'fa fa-refresh fa-2x rotate' : 'fa fa-refresh fa-2x'}
          />
        </button>
      </div>
    </>
  );
};

export default Synchronize;
