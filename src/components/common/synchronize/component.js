import React, { useState, useEffect /* useContext */ } from 'react';
import { useHistory } from 'react-router-dom';
import Modal from 'react-modal';
import imgSync from 'img/sync.png';
import { addOnlineStatusObserver } from 'common-tools/';
import { synchronizePearl, synchronizeQueen } from 'common-tools/synchronize';
import D from 'i18n';
import Loader from '../loader';
import './result.scss';

Modal.setAppElement('#root');

const Synchronize = ({ disabled = false }) => {
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
    const pearlSynchResult = window.localStorage.getItem('pearl-sync-result');
    const queenSynchResult = window.localStorage.getItem('queen-sync-result');
    console.log('pearlSynchResult ', pearlSynchResult);
    console.log(pearlSynchResult);
    console.log('queenSynchResult ', queenSynchResult);

    if (pearlSync) {
      if (pearlSync === 'FAILURE') {
        console.log('pealSync FAILURE');
        setLoading(false);
        setSyncResult({ state: false, message: D.syncFailure });
      }
    } else if (pearlSynchResult !== null && queenSynchResult !== null) {
      console.log('localStorage synch not undefined');
      if (pearlSynchResult === 'success' && queenSynchResult === 'success') {
        console.log('and successful :)');
        setSyncResult({ state: true, message: D.syncSuccess });
      } else {
        console.log('and unsuccessful :(');
        setSyncResult({ state: false, message: D.syncFailure });
      }
    }
  }, [pearlSync, history]);

  const syncFunction = () => {
    window.localStorage.removeItem('pearl-sync-result');
    window.localStorage.removeItem('queen-sync-result');

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
            window.localStorage.setItem('pearl-sync-result', 'success');
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
    window.localStorage.removeItem('pearl-sync-result');
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

      <div className="sync" disabled={disabled}>
        <img alt="sync-logo" className={loading ? 'rotate' : ''} height="30px" src={imgSync} />
        <button type="button" disabled={disabled} onClick={() => syncOnClick()}>
          {D.synchronizeButton}
        </button>
      </div>
    </>
  );
};

export default Synchronize;
