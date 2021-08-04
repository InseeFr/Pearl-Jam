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
import { synchronizePearl, useQueenSynchronisation } from 'utils/synchronize';
import D from 'i18n';
import React, { useContext, useEffect, useState } from 'react';
import { analyseResult, saveSyncPearlData } from 'utils/synchronize/check';
import * as api from 'utils/api';
import { AppContext } from 'Root';
import Preloader from 'components/common/loader';
import { IconStatus } from 'components/common/IconStatus';

export const SynchronizeWrapperContext = React.createContext();

const useStyles = makeStyles(theme => ({
  dialogPaper: {
    borderRadius: '15px',
  },

  subTitle: {
    '& span': {
      marginLeft: '1em',
      alignSelf: 'center',
    },
    display: 'flex',
    marginBottom: '1.5em',
  },
  noVisibleFocus: {
    '&:focus, &:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
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
      setPearlReady(true);
      setPearlError(false);
    } else {
      setPearlReady(false);
      setPearlError(true);
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
      const result = await synchronizePearl(PEARL_API_URL, PEARL_AUTHENTICATION_MODE);
      saveSyncPearlData(result);
      await synchronizeQueen();
    };
    if (queenReady !== null && pearlReady !== null) {
      if (queenReady && pearlReady) {
        sync();
      }
      if (queenError || pearlError) {
        const result = {
          state: 'error',
          messages: [D.noResponseFromServer],
        };
        window.localStorage.removeItem('SYNCHRONIZE');
        setIsSync(false);
        setSyncResult(result);
        setLoading(false);
      }
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

  const context = { syncFunction };

  return (
    <SynchronizeWrapperContext.Provider value={context}>
      {componentReady && (loading || isSync) && <Preloader message={D.synchronizationInProgress} />}
      {componentReady && !loading && !isSync && syncResult && (
        <Dialog
          className={classes.syncResult}
          open={!!syncResult}
          onClose={close}
          PaperProps={{ className: classes.dialogPaper }}
        >
          <DialogTitle>
            <Typography variant="h4" color={syncResult.state === 'error' ? 'error' : 'initial'}>
              {D.syncResult}
            </Typography>
          </DialogTitle>
          <Divider />

          <DialogContent>
            {syncResult.state && (
              <DialogContentText className={classes.subTitle}>
                <IconStatus type={syncResult.state} />
                <span>{D.titleSync(syncResult.state)}</span>
              </DialogContentText>
            )}
            {syncResult?.messages?.map(message => (
              <DialogContentText>{message}</DialogContentText>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={close}>{`J'ai compris`}</Button>
          </DialogActions>
        </Dialog>
      )}
      {componentReady && !loading && !isSync && children}
    </SynchronizeWrapperContext.Provider>
  );
};

export default SynchronizeWrapper;
