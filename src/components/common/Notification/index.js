import { Button, CircularProgress, makeStyles, Slide, Snackbar } from '@material-ui/core';
import useTimer from 'common-tools/hooks/useTimer';
import D from 'i18n';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

const useStyles = makeStyles(() => ({
  root: {
    top: '0',
  },
  content: {
    backgroundColor: 'rgba(46, 139, 166, 0.9)',
  },
}));

const SlideTransition = props => <Slide {...props} direction="down" />;

const Notification = ({ serviceWorkerInfo }) => {
  const [open, setOpen] = useState(true);
  const [progress, setProgress] = useTimer(setOpen);
  const {
    installingServiceWorker,
    waitingServiceWorker,
    isUpdateAvailable,
    isServiceWorkerInstalled,
  } = serviceWorkerInfo;

  const updateAssets = () => {
    if (waitingServiceWorker) {
      waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  useEffect(() => {
    if (waitingServiceWorker) {
      waitingServiceWorker.addEventListener('statechange', event => {
        if (event.target.state === 'activated') {
          window.location.reload();
        }
      });
    }
  }, [waitingServiceWorker]);

  const getMessage = () => {
    if (isUpdateAvailable) return D.updateAvailable;
    if (isServiceWorkerInstalled) return D.appReadyOffline;
    if (installingServiceWorker) return D.appInstalling;
    return '';
  };

  const classes = useStyles();

  return (
    <Snackbar
      open={(isUpdateAvailable || isServiceWorkerInstalled || installingServiceWorker) && open}
      className={classes.root}
      TransitionComponent={SlideTransition}
      ContentProps={{ className: classes.content }}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      message={getMessage()}
      onClose={() => setOpen(false)}
      onEntering={() => setProgress(1)}
      action={
        // eslint-disable-next-line react/jsx-wrap-multilines
        <Button
          color="inherit"
          size="small"
          onClick={isUpdateAvailable ? updateAssets : () => setOpen(false)}
        >
          {isUpdateAvailable ? D.updateNow : D.closeButton}
          <CircularProgress value={progress.current} color="inherit" variant="determinate" />
        </Button>
      }
    />
  );
};

export default Notification;
Notification.propTypes = {
  serviceWorkerInfo: PropTypes.shape({
    installingServiceWorker: PropTypes.shape({}).isRequired,
    waitingServiceWorker: PropTypes.shape({
      postMessage: PropTypes.shape({}),
      addEventListener: PropTypes.shape({}),
    }).isRequired,
    isUpdateAvailable: PropTypes.shape({}).isRequired,
    isServiceWorkerInstalled: PropTypes.shape({}).isRequired,
  }).isRequired,
};
