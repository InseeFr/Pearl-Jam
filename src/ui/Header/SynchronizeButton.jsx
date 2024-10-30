import SyncIcon from '@mui/icons-material/Sync';
import Button from '@mui/material/Button';
import { useContext } from 'react';
import D from '../../i18n/build-dictionary';
import { useNetworkOnline } from '../../utils/hooks/useOnline';
import { SyncContext } from '../Sync/SyncContextProvider';

export function SynchronizeButton() {
  const isOnline = useNetworkOnline();
  const { syncFunction } = useContext(SyncContext);
  return (
    <Button
      disabled={!isOnline}
      color="surfaceSecondary"
      variant="contained"
      onClick={syncFunction}
      startIcon={<SyncIcon fontSize="small" />}
    >
      {D.synchronizeButton}
    </Button>
  );
}
