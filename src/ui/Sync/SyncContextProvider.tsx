import { createContext, PropsWithChildren, useEffect, useMemo, useState } from 'react';

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
  notificationOpened: 'NORMAL' | 'LAST_NOTIF_OPENED' | false;
  setNotificationOpened: (value: 'NORMAL' | 'LAST_NOTIF_OPENED' | false) => void;
  setSyncResult: (value: {
    date: string;
    state: NotificationState;
    messages: string[] | string;
    details: any;
  }) => void;
  syncFunction: (event: any) => void;
};
export const SyncContext = createContext<SyncContextValue | undefined>(undefined);

export function SyncContextProvider({ children }: Readonly<PropsWithChildren<unknown>>) {
  const online = useNetworkOnline();
  const PEARL_API_URL = import.meta.env.VITE_PEARL_API_URL;
  const PEARL_AUTHENTICATION_MODE = import.meta.env.VITE_PEARL_AUTHENTICATION_MODE;
  const { synchronizeQueen, queenReady, queenError } = useQueenSynchronisation();

  const [notificationOpened, setNotificationOpened] = useState<
    'NORMAL' | 'LAST_NOTIF_OPENED' | false
  >(false);
  const [isSync, setIsSync] = useState(() => {
    return globalThis.localStorage.getItem('SYNCHRONIZE') === 'true';
  });
  const [loading, setLoading] = useState(false);
  const [syncResult, setSyncResult] = useState<
    undefined | null | { state: NotificationState; messages: string | string[] }
  >(null);
  const [componentReady, setComponentReady] = useState(false);

  const [pearlReady, setPearlReady] = useState<boolean | null>(null);
  const [pearlError, setPearlError] = useState(false);

  const checkPearl = async () => {
    setPearlReady(null);
    const { status } = await healthCheck();
    if (status === 200) {
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
      const result = await analyseResult();
      globalThis.localStorage.removeItem('SYNCHRONIZE');
      setIsSync(false);
      setSyncResult(result);
    };

    if (PEARL_API_URL && PEARL_AUTHENTICATION_MODE && isSync && !loading) analyse();
  }, [PEARL_API_URL, PEARL_AUTHENTICATION_MODE, isSync, loading]);

  const syncFunction = () => {
    const launchSynchronize = async () => {
      globalThis.localStorage.removeItem('PEARL_SYNC_RESULT');
      globalThis.localStorage.removeItem('QUEEN_SYNC_RESULT');
      globalThis.localStorage.setItem('SYNCHRONIZE', 'true');
      setLoading(true);
      await checkPearl();
    };
    if (online) launchSynchronize();
  };

  const handleClose = async () => {
    setSyncResult(null);
    globalThis.localStorage.removeItem('PEARL_SYNC_RESULT');
    globalThis.localStorage.removeItem('QUEEN_SYNC_RESULT');
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
      if (!error) await synchronizeQueen();
      else setLoading(false);
    };

    const failedSync = async () => {
      const result = {
        state: 'error' as NotificationState,
        messages: [D.syncNotStarted, D.syncPleaseTryAgain, D.warningOrErrorEndMessage],
      };
      const notif = getNotifFromResult(result);
      await notificationIdbService.addOrUpdateNotif(notif);
      globalThis.localStorage.removeItem('SYNCHRONIZE');
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

  const context = useMemo(
    () => ({ syncFunction, setSyncResult, notificationOpened, setNotificationOpened }),
    [syncFunction, setSyncResult]
  );

  const syncMesssage = () => {
    if (loading && isSync) return D.synchronizationInProgress;
    if (loading) return D.synchronizationWaiting;
    if (isSync) return D.synchronizationEnding;
  };

  return (
    <SyncContext.Provider value={context}>
      {componentReady && (loading || isSync) && <Preloader message={syncMesssage()} />}
      {syncResult && (
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
