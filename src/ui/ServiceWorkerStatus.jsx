import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Slide from '@mui/material/Slide';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import { useEffect, useState } from 'react';
import D from '../i18n/build-dictionary';
import { useServiceWorker } from '../utils/hooks/useServiceWorker';

/**
 * @returns {string}
 */
const getMessageFromState = state => {
  if (state.isUpdating) return D.updating;
  else if (state.isUpdateInstalled) return D.updateInstalled;
  else if (state.isUpdateAvailable) return D.updateAvailable;
  else if (state.isServiceWorkerInstalled) return D.appReadyOffline;
  else if (state.isInstallingServiceWorker) return D.appInstalling;
  else if (state.isInstallationFailed) return D.installError;
  return '';
};

const getSeverity = state => {
  if (state.isInstallationFailed) return 'error';
  if (state.isUpdateInstalled || state.isServiceWorkerInstalled) return 'success';
  return 'info';
};

/**
 * Display an alert depending of service worker loading state
 * @param {boolean} authenticated
 */
export function ServiceWorkerStatus({ authenticated }) {
  const state = useServiceWorker(authenticated);
  const message = getMessageFromState(state);
  const severity = getSeverity(state);
  const [isOpen, setOpen] = useState(!!message);

  /**
   * Message can be null at start and can change asynchronously, we have to update "isOpen" state according to new message value
   * isOpen is true if message is not a empty string
   */
  useEffect(() => {
    setOpen(!!message);
  }, [message]);

  const handleClose = () => {
    setOpen(false);
    if (state.isUpdateInstalled) {
      state.clearUpdating();
    }
  };
  const canUpdate = state.isUpdateAvailable && !state.isUpdating;

  return (
    <Snackbar
      TransitionComponent={SlideTransition}
      sx={{ width: '80%', maxWidth: '1100px' }}
      open={isOpen}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert variant="filled" sx={{ width: 1 }} severity={severity} onClose={handleClose}>
        <Stack gap={2} alignItems="flex-start">
          {message}
          {canUpdate && (
            <Button variant="contained" onClick={state.updateApp}>
              {D.updateNow}
            </Button>
          )}
        </Stack>
      </Alert>
    </Snackbar>
  );
}

function SlideTransition(props) {
  return <Slide direction="down" {...props} />;
}
