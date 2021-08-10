import {
  Dialog,
  DialogTitle,
  Divider,
  makeStyles,
  Typography,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
} from '@material-ui/core';
import notificationIdbService from 'indexedbb/services/notification-idb-service';
import { synchronizePearl, useQueenSynchronisation } from 'utils/synchronize';
import D from 'i18n';
import React, { useContext, useEffect, useState } from 'react';
import { analyseResult, getNotifFromResult, saveSyncPearlData } from 'utils/synchronize/check';
import * as api from 'utils/api';
import { AppContext } from 'Root';
import Preloader from 'components/common/loader';
import { IconStatus } from 'components/common/IconStatus';
import { ThumbUpAlt } from '@material-ui/icons';

export const SynchronizeWrapperContext = React.createContext();

const useStyles = makeStyles(theme => ({
  dialogPaper: {
    borderRadius: '15px',
  },
  title: {
    '& *': {
      fontSize: '1.4em',
    },
  },
  subTitle: {
    '& span': {
      fontWeight: 'bold',
      marginLeft: '1em',
      alignSelf: 'center',
    },
    display: 'flex',
    marginBottom: '1.5em',
  },
  content: {
    '& span': {
      alignSelf: 'center',
    },

    display: 'flex',
  },
  noVisibleFocus: {
    '&:focus, &:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
  positive: { marginLeft: '0.5em', color: theme.palette.success.main },
}));

const SynchronizeWrapper = ({ children }) => {
  const { online, PEARL_API_URL, PEARL_AUTHENTICATION_MODE } = useContext(AppContext);
  const { checkQueen, synchronizeQueen, queenReady, queenError } = useQueenSynchronisation();

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
      checkQueen();
      await checkPearl();
    };
    if (online) launchSynchronize();
  };

  const close = async () => {
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

  const classes = useStyles();

  const context = { syncFunction, setSyncResult };

  const syncMesssage = () => {
    if (loading && isSync) return D.synchronizationInProgress;
    if (loading) return D.synchronizationWaiting;
    if (isSync) return D.synchronizationEnding;
  };

  return (
    <SynchronizeWrapperContext.Provider value={context}>
      {componentReady && (loading || isSync) && <Preloader message={syncMesssage()} />}
      {componentReady && !loading && !isSync && syncResult && (
        <Dialog
          maxWidth="md"
          className={classes.syncResult}
          open={!!syncResult}
          onClose={close}
          PaperProps={{ className: classes.dialogPaper }}
        >
          <DialogTitle
            className={classes.title}
            color={syncResult.state === 'error' ? 'error' : 'initial'}
          >
            <Typography>{D.syncResult}</Typography>
          </DialogTitle>
          <Divider />

          <DialogContent>
            {syncResult.state && (
              <DialogContentText className={classes.subTitle}>
                <IconStatus type={syncResult.state} />
                <span>{D.titleSync(syncResult.state)}</span>
                {syncResult.date && <span>{`(${syncResult.date})`}</span>}
              </DialogContentText>
            )}
            {syncResult.messages?.map((message, index) => (
              <DialogContentText key={index} className={classes.content}>
                <span>{message}</span>
                {syncResult.state === 'warning' && index === syncResult.messages.length - 1 && (
                  <ThumbUpAlt className={classes.positive} />
                )}
              </DialogContentText>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={close}>{D.iUnderstand}</Button>
          </DialogActions>
        </Dialog>
      )}
      {componentReady && !loading && !isSync && children}
    </SynchronizeWrapperContext.Provider>
  );
};

export default SynchronizeWrapper;
