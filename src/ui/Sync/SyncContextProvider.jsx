import React, { useEffect, useState } from 'react';
import * as api from 'utils/api';

import { analyseResult, getNotifFromResult, saveSyncPearlData } from 'utils/synchronize/check';
import { synchronizePearl, useQueenSynchronisation } from 'utils/synchronize';
import D from 'i18n';
import { Preloader } from '../Preloader';
import { SyncDialog } from './SyncDialog';
import notificationIdbService from 'utils/indexeddb/services/notification-idb-service';
import { useNetworkOnline } from '../../utils/hooks/useOnline';
import { useConfiguration } from '../../utils/hooks/useConfiguration';

export const SyncContext = React.createContext();

export function SyncContextProvider({ children }) {
  const online = useNetworkOnline();
  const { PEARL_API_URL, PEARL_AUTHENTICATION_MODE } = useConfiguration();
  const { synchronizeQueen, queenReady, queenError } = useQueenSynchronisation();

  const [isSync, setIsSync] = useState(() => {
    return window.localStorage.getItem('SYNCHRONIZE') === 'true';
  });
  const [loading, setLoading] = useState(false);
  const [syncResult, setSyncResult] = useState(undefined);
  const [componentReady, setComponentReady] = useState(false);

  const [pearlReady, setPearlReady] = useState(null);
  const [pearlError, setPearlError] = useState(false);

  const checkPearl = async () => {
    setPearlReady(null);
    const { error, status } = await api.healthCheck(PEARL_API_URL, PEARL_AUTHENTICATION_MODE);
    if (!error && status === 200) {
      setPearlError(false);
      setPearlReady(true);
    } else {
      setPearlError(true);
      setPearlReady(true);
    }
  };

  useEffect(() => {
    setComponentReady(true);
  }, [isSync]);

  useEffect(() => {
    const analyse = async () => {
      const result = await analyseResult(PEARL_API_URL, PEARL_AUTHENTICATION_MODE);
      window.localStorage.removeItem('SYNCHRONIZE');
      setIsSync(false);
      setSyncResult(result);
    };

    if (PEARL_API_URL && PEARL_AUTHENTICATION_MODE && isSync && !loading) analyse();
  }, [PEARL_API_URL, PEARL_AUTHENTICATION_MODE, isSync, loading]);

  const syncFunction = () => {
    const launchSynchronize = async () => {
      window.localStorage.removeItem('PEARL_SYNC_RESULT');
      window.localStorage.removeItem('QUEEN_SYNC_RESULT');
      window.localStorage.setItem('SYNCHRONIZE', true);
      setLoading(true);
      //checkQueen();
      await checkPearl();
    };
    if (online) launchSynchronize();
  };

  const handleClose = async () => {
    setSyncResult(null);
    window.localStorage.removeItem('PEARL_SYNC_RESULT');
    window.localStorage.removeItem('QUEEN_SYNC_RESULT');
  };

  useEffect(() => {
    const sync = async () => {
      setIsSync(true);
      const result = await synchronizePearl(PEARL_API_URL, PEARL_AUTHENTICATION_MODE);
      saveSyncPearlData(result);
      const { error } = result;
      if (!error) await synchronizeQueen();
      else setLoading(false);
    };

    const failedSync = async () => {
      const result = {
        state: 'error',
        messages: [D.syncNotStarted, D.syncPleaseTryAgain, D.warningOrErrorEndMessage],
      };
      const notif = getNotifFromResult(result);
      await notificationIdbService.addOrUpdateNotif(notif);
      window.localStorage.removeItem('SYNCHRONIZE');
      setIsSync(false);
      setSyncResult(result);
      setLoading(false);
    };
    if (queenReady && pearlReady) {
      if (!queenError && !pearlError) sync();
      else failedSync();
    }
  }, [
    queenReady,
    queenError,
    pearlReady,
    pearlError,
    synchronizeQueen,
    PEARL_API_URL,
    PEARL_AUTHENTICATION_MODE,
  ]);

  const context = { syncFunction, setSyncResult };

  const syncMesssage = () => {
    if (loading && isSync) return D.synchronizationInProgress;
    if (loading) return D.synchronizationWaiting;
    if (isSync) return D.synchronizationEnding;
  };

  return (
    <SyncContext.Provider value={context}>
      {componentReady && (loading || isSync) && <Preloader message={syncMesssage()} />}
      {componentReady && !loading && !isSync && syncResult && (
        <SyncDialog onClose={handleClose} syncResult={syncResult} />
      )}
      {componentReady && !loading && !isSync && children}
    </SyncContext.Provider>
  );
}
