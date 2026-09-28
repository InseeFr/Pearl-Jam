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
import { useLocation, useNavigate } from 'react-router-dom';

const SYNC_RETURN_URL_KEY = 'SYNC_RETURN_URL';

export type SyncContextValue = {
  notificationOpened: 'NORMAL' | 'LAST_NOTIF_OPENED' | false;
  setNotificationOpened: (value: 'NORMAL' | 'LAST_NOTIF_OPENED' | false) => void;
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
  const navigate = useNavigate();
  const location = useLocation();

  const [notificationOpened, setNotificationOpened] = useState<
    'NORMAL' | 'LAST_NOTIF_OPENED' | false
  >(false);
  const [isSync, setIsSync] = useState(() => {
    return globalThis.localStorage.getItem('SYNCHRONIZE') === 'true';
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

  // Restaure la navigation vers l'URL sauvegardée avant la sync (path + search params)
  const restoreReturnUrl = useCallback(() => {
    const returnUrl = window.localStorage.getItem(SYNC_RETURN_URL_KEY);
    window.localStorage.removeItem(SYNC_RETURN_URL_KEY);

    if (returnUrl) {
      navigate(returnUrl, { replace: true });
    }
  }, [navigate]);

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
      restoreReturnUrl();
    };

    recoverPearlSync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        restoreReturnUrl();
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
      restoreReturnUrl();
    };

    recoverQueenSync();
  }, [resetLocalstorageSyncEntries, stopSync, restoreReturnUrl]);

  const syncFunction = useCallback(() => {
    const launchSynchronize = async () => {
      resetLocalstorageSyncEntries();

      // Sauvegarde l'URL courante (path + search params) avant de lancer la sync
      const currentUrl = `${location.pathname}${location.search}`;
      window.localStorage.setItem(SYNC_RETURN_URL_KEY, currentUrl);

      window.localStorage.setItem('SYNCHRONIZE', 'true');
      setLoading(true);
      await checkPearl();
    };

    if (online) launchSynchronize();
  }, [online, resetLocalstorageSyncEntries, location.pathname, location.search]);

  const handleClose = async () => {
    setSyncResult(null);
    resetLocalstorageSyncEntries();
  };

  const handleNotificationClick = () => {
    handleClose();
    setNotificationOpened('LAST_NOTIF_OPENED');
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
        restoreReturnUrl();
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
      restoreReturnUrl();
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
    stopSync,
    restoreReturnUrl,
  ]);

  const context = useMemo(
    () => ({ syncFunction, setSyncResult, notificationOpened, setNotificationOpened }),
    [syncFunction, setSyncResult, notificationOpened]
  );

  const syncMessage = () => {
    if (loading && isSync) return D.synchronizationInProgress;
    if (loading) return D.synchronizationWaiting;
    if (isSync) return D.synchronizationEnding;
  };

  return (
    <SyncContext.Provider value={context}>
      {componentReady && (loading || isSync) && <Preloader message={syncMessage()} />}
      {componentReady && !loading && !isSync && syncResult && (
        <SyncDialog
          onClose={handleClose}
          onNotificationClick={handleNotificationClick}
          syncResult={syncResult}
        />
      )}
      {componentReady && !loading && !isSync && children}
    </SyncContext.Provider>
  );
}
