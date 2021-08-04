import { Dialog, makeStyles, Typography } from '@material-ui/core';
import { synchronizePearl, useQueenSynchronisation } from 'utils/synchronize';
import D from 'i18n';
import React, { useContext, useEffect, useState } from 'react';
import { analyseResult, saveSyncPearlData } from 'utils/synchronize/check';
import * as api from 'utils/api';
import { AppContext } from 'Root';
import Preloader from 'components/common/loader';

export const SynchronizeWrapperContext = React.createContext();

const useStyles = makeStyles(theme => ({
  dialogPaper: {
    padding: '1em',
    borderRadius: '15px',
    textAlign: 'center',
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
      const { message } = await analyseResult(PEARL_API_URL, PEARL_AUTHENTICATION_MODE);
      window.localStorage.removeItem('SYNCHRONIZE');
      setIsSync(false);
      setSyncResult({ state: true, message });
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
          state: false,
          message: 'Le serveur ne répond pas, nous vous invitons à réessayer plus tard',
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
          onClick={close}
          PaperProps={{ className: classes.dialogPaper }}
        >
          <Typography variant="h4" color={syncResult.state ? 'initial' : 'error'}>
            {D.syncResult}
          </Typography>
          <Typography variant="h6">{syncResult.message}</Typography>
        </Dialog>
      )}
      {componentReady && !loading && !isSync && !syncResult && children}
    </SynchronizeWrapperContext.Provider>
  );
};

export default SynchronizeWrapper;
