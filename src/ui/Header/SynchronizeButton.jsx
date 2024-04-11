import Button from '@mui/material/Button';
import SyncIcon from '@mui/icons-material/Sync';
import React, { useContext } from 'react';
import { SyncContext } from '../Sync/SyncContextProvider';
import { useNetworkOnline } from '../../utils/hooks/useOnline';
import D from '../../i18n/build-dictionary';

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
