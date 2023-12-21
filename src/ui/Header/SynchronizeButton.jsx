import Button from '@mui/material/Button';
import SyncIcon from '@mui/icons-material/Sync';
import React, { useContext } from 'react';
import { SynchronizeWrapperContext } from '../../components/sychronizeWrapper';
import { useNetworkOnline } from '../../utils/hooks/useOnline';

export function SynchronizeButton() {
  const isOnline = useNetworkOnline();
  const { syncFunction } = useContext(SynchronizeWrapperContext);
  return (
    <Button
      disabled={!isOnline}
      color="surfaceSecondary"
      variant="contained"
      onClick={syncFunction}
      startIcon={<SyncIcon fontSize="small" />}
    >
      Synchroniser
    </Button>
  );
}
