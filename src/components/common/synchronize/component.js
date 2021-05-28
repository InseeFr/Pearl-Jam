import { Dialog, makeStyles, Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { addOnlineStatusObserver } from 'common-tools';
import SyncIcon from 'common-tools/icons/SyncIcon';
import { synchronizePearl, synchronizeQueen } from 'common-tools/synchronize';
import D from 'i18n';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Loader from '../loader';

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

const Synchronize = ({ materialClass }) => {
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

  const classes = useStyles();

  return (
    <>
      {loading && <Loader message={D.synchronizationInProgress} />}
      {!loading && syncResult && (
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

      <IconButton
        classes={{
          root: classes.noVisibleFocus,
        }}
        edge="end"
        disabled={status !== true}
        aria-label="launch synchronization"
        onClick={() => syncOnClick()}
      >
        <SyncIcon className={materialClass} />
      </IconButton>
    </>
  );
};

export default Synchronize;
Synchronize.propTypes = {
  materialClass: PropTypes.string.isRequired,
};
