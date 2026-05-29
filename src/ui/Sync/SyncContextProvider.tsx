import { createContext, PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';

import { healthCheck } from 'api/pearl';
import D from 'i18n';
import { NotificationState } from 'types/pearl';
import notificationIdbService from 'utils/indexeddb/services/notification-idb-service';
import { synchronizePearl, useQueenSynchronisation } from 'utils/synchronize';
import { analyseResult, getNotifFromResult, saveSyncPearlData } from 'utils/synchronize/check';
import { useNetworkOnline } from '../../utils/hooks/useOnline';
import { Preloader } from '../Preloader';
import { SyncDialog } from './SyncDialog';

export type SyncContextValue = {
  setSyncResult: (value: {
    date?: string;
    state: NotificationState;
    messages: string[] | string;
    details?: any;
  }) => void;
  syncFunction: (event?: any) => void;
};

export const SyncContext = createContext<SyncContextValue | undefined>(undefined);

export function SyncContextProvider({ children }: Readonly<PropsWithChildren<unknown>>) {
  const online = useNetworkOnline();
  const { synchronizeQueen, queenReady, queenError } = useQueenSynchronisation();

  const [isSync, setIsSync] = useState(() => {
    return window.localStorage.getItem('SYNCHRONIZE') === 'true';
  });

  const [loading, setLoading] = useState(false);

  const [syncResult, setSyncResult] = useState<
    undefined | null | { state: NotificationState; messages: string | string[] }
  >(undefined);

  const [componentReady, setComponentReady] = useState(false);
  const [pearlReady, setPearlReady] = useState<boolean | null>(null);
  const [pearlError, setPearlError] = useState(false);

  const resetLocalstorageSyncEntries = useCallback(() => {
    window.localStorage.removeItem('PEARL_SYNC_RESULT');
    window.localStorage.removeItem('QUEEN_SYNC_INITIATED');
    window.localStorage.removeItem('QUEEN_SYNC_RESULT');
  }, []);

  const stopSync = useCallback(() => {
    window.localStorage.removeItem('SYNCHRONIZE');
    setIsSync(false);
    setLoading(false);
    setPearlReady(null);
  }, []);

  const checkPearl = async () => {
    setPearlReady(null);
    try {
      const { status } = await healthCheck();
      setPearlError(status !== 200);
    } catch {
      setPearlError(true);
    } finally {
      setPearlReady(true);
    }
  };

  useEffect(() => {
    setComponentReady(true);
  }, []);

  /**
    * Recovery when returning from crashing/closing the app during the pearl synchronization.
    *
    */
  useEffect(() => {
    const recoverPearlSync = async () => {
      const syncStarted = window.localStorage.getItem('SYNCHRONIZE') === 'true';
      const queenSyncInitiated = window.localStorage.getItem('QUEEN_SYNC_INITIATED') === 'true';
      const pearlSyncResult = window.localStorage.getItem('PEARL_SYNC_RESULT');

      if (!syncStarted || queenSyncInitiated || !pearlSyncResult) return;

      const analysis = await analyseResult();
      setSyncResult(analysis);
      resetLocalstorageSyncEntries();
      stopSync();
    };

    recoverPearlSync();
  }, []);


  /**
   * Recovery when returning from /queen/*
   *
   * AppWrapper + SyncContextProvider are unmounted while the user is on /queen/*.
   * So the useful detection point is this provider mounting again after returning to /.
   */
  useEffect(() => {
    const recoverQueenSync = async () => {
      const queenSyncInitiated = window.localStorage.getItem('QUEEN_SYNC_INITIATED') === 'true';
      const queenSyncResult = window.localStorage.getItem('QUEEN_SYNC_RESULT');

      if (!queenSyncInitiated) return;

      if (!queenSyncResult) {
        setSyncResult({
          state: 'error' as NotificationState,
          messages: [D.queenSyncMayHaveBeenInterrupted, D.syncPleaseTryAgain],
        });

        resetLocalstorageSyncEntries();
        stopSync();
        return;
      }

      try {
        JSON.parse(queenSyncResult);
        const analysis = await analyseResult();
        setSyncResult(analysis);
      } catch (parseError) {
        console.error('Failed to parse QUEEN_SYNC_RESULT:', parseError);

        setSyncResult({
          state: 'error' as NotificationState,
          messages: [D.queenSyncResultInvalid, D.syncPleaseTryAgain],
        });
      }

      resetLocalstorageSyncEntries();
      stopSync();
    };

    recoverQueenSync();
  }, [resetLocalstorageSyncEntries, stopSync]);


  const syncFunction = useCallback(() => {
    const launchSynchronize = async () => {
      resetLocalstorageSyncEntries();
      window.localStorage.setItem('SYNCHRONIZE', 'true');
      setLoading(true);
      await checkPearl();
    };

    if (online) launchSynchronize();
  }, [online, resetLocalstorageSyncEntries]);

  const handleClose = async () => {
    setSyncResult(null);
    resetLocalstorageSyncEntries();
  };

  useEffect(() => {
    const sync = async () => {
      setIsSync(true);

      const result = await synchronizePearl();
      saveSyncPearlData(result);

      const { error } = result;

      if (error) {
        const analysis = await analyseResult();
        setSyncResult(analysis);
        stopSync();
        return;
      }

      window.localStorage.setItem('QUEEN_SYNC_INITIATED', 'true');
      await synchronizeQueen();

    };

    const failedSync = async () => {
      const result = {
        state: 'error' as NotificationState,
        messages: [D.syncNotStarted, D.syncPleaseTryAgain, D.warningOrErrorEndMessage],
      };

      const notif = getNotifFromResult(result);
      await notificationIdbService.addOrUpdateNotif(notif);

      setSyncResult(result);
      stopSync();
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
  ]);

  const context = useMemo(() => ({ syncFunction, setSyncResult }), [syncFunction]);

  const syncMessage = () => {
    if (loading && isSync) return D.synchronizationInProgress;
    if (loading) return D.synchronizationWaiting;
    if (isSync) return D.synchronizationEnding;
  };

  return (
    <SyncContext.Provider value={context}>
      {componentReady && (loading || isSync) && <Preloader message={syncMessage()} />}
      {componentReady && !loading && !isSync && syncResult && (
        <SyncDialog onClose={handleClose} syncResult={syncResult} />
      )}
      {componentReady && !loading && !isSync && children}
    </SyncContext.Provider>
  );
}