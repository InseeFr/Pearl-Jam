import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Modal from 'react-modal';
import imgSync from 'img/sync.png';
import { addOnlineStatusObserver } from 'common-tools/';
import { synchronize } from 'common-tools/synchronize';
import D from 'i18n';
import { store } from 'common-tools/store';
import Loader from '../loader';
import './result.scss';

Modal.setAppElement('#root');

const Synchronize = ({ disabled = false }) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [syncResult, setSyncResult] = useState(undefined);
  const [queenSync, setQueenSync] = useState(undefined);
  const [pearlSync, setPearlSync] = useState(undefined);

  const [init, setInit] = useState(false);
  const [status, setStatus] = useState(navigator.onLine);

  const { dispatch, authenticated } = useContext(store);

  const handleQueenEvent = event => {
    const { type, command, state } = event.detail;
    if (type === 'QUEEN' && command === 'UPDATE_SYNCHRONIZE') {
      if (state === 'FAILURE') {
        setQueenSync('FAILURE');
      } else if (state === 'SUCCESS') {
        setQueenSync('SUCCESS');
      }

      setTimeout(() => setLoading(false), 3000);
    }
  };

  useEffect(() => {
    if (!init) {
      addOnlineStatusObserver(s => {
        setStatus(s);
      });
      setInit(true);
    }
  }, [init]);

  useEffect(() => {
    window.addEventListener('QUEEN', handleQueenEvent);
    return () => {
      window.removeEventListener('QUEEN', handleQueenEvent);
    };
  });

  useEffect(() => {
    if (pearlSync && queenSync) {
      console.log(`pearlSync && queenSync :  ${pearlSync} -   ${queenSync}`);
      if (queenSync === 'SUCCESS' && pearlSync === 'SUCCESS') {
        setSyncResult({ state: true, message: D.syncSuccess });
      } else {
        setSyncResult({ state: false, message: D.syncFailure });
      }
      setLoading(false);
      history.push('/');
    }
  }, [pearlSync, queenSync, history]);

  const syncFunction = () => {
    const launchSynchronize = async () => {
      try {
        setPearlSync(undefined);
        setQueenSync(undefined);
        setLoading(true);

        await synchronize();

        setPearlSync('SUCCESS');
      } catch (e) {
        console.log(e.message);
        setPearlSync('FAILURE');
      } finally {
        console.log('Pearl synchronization : ENDED !');
      }
    };
    launchSynchronize();
    if (!authenticated) {
      dispatch({ type: 'initAuth' });
    }
  };

  const syncOnClick = () => {
    if (!loading && status) {
      syncFunction();
    } else {
      console.log('offline');
    }
  };

  const close = () => setSyncResult(undefined);

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
