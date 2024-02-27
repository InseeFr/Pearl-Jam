import Box from '@mui/material/Box';
import D from 'i18n';
import Alert from '@mui/material/Alert';
import WarningIcon from '@mui/icons-material/Warning';
import React, { useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { Row } from '../ui/Row';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import { useToggle } from 'utils/hooks/useToggle';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import OutlinedInput from '@mui/material/OutlinedInput';
import { FormHelperText } from '@mui/material';
import { PEARL_USER_KEY } from 'utils/constants';
import Dexie from 'dexie';
import { unregister } from '../serviceWorkerRegistration';
import { generateRandomInt } from '../utils/functions/random';

export function ResetData() {
  const [state, setState] = useState(D.youCanDeleteData);
  const [isConfirmOpen, toggleDialog] = useToggle(false);

  const goBack = () => {
    window.location = window.location.origin;
  };

  const handleDeleteAll = async () => {
    toggleDialog();
    setState(D.deleting);
    try {
      const databases = await Dexie.getDatabaseNames();
      await Promise.all(databases.map(db => Dexie.delete(db)));
      unregister();
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
      window.localStorage.clear();
      setState(D.deleteSuccess);
    } catch (e) {
      console.error(`Error deleting the database`, e);
      setState(D.deleteFailed);
    }
  };
  return (
    <Stack gap={2} p={4}>
      <Alert severity="error" icon={<WarningIcon fontSize="inherit" />}>
        {D.mainTitle}
      </Alert>
      <Box>{state}</Box>
      <Row gap={2}>
        <Button
          variant="contained"
          onClick={goBack}
          startIcon={<HomeOutlinedIcon />}
          disabled={state === 'deleting'}
        >
          {D.goBackToHome}
        </Button>
        <Button
          variant="contained"
          color="danger"
          onClick={toggleDialog}
          startIcon={<DeleteIcon />}
        >
          {D.deleteAll}
        </Button>
      </Row>
      <ConfirmDialog open={isConfirmOpen} onConfirm={handleDeleteAll} onCancel={toggleDialog} />
    </Stack>
  );
}

function ConfirmDialog({ open, onConfirm, onCancel }) {
  const randomText = useMemo(
    () => generateRandomInt().toString(36).substring(2, 10).toUpperCase(),
    []
  );
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const handleSubmit = e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    if (step === 0) {
      setStep(1);
      return;
    }
    if (step === 1) {
      const isValid = formData.get('code') === randomText;
      if (!isValid) {
        setError(D.confirmError);
      } else {
        setStep(2);
        setError('');
      }
      return;
    }
    const { id } = JSON.parse(window.localStorage.getItem(PEARL_USER_KEY) || '{}');
    if ((id || '').toLowerCase() === formData.get('code').toLowerCase()) {
      onConfirm();
    } else {
      setError(D.confirmError);
    }
  };

  return (
    <Dialog open={open} onClose={onCancel}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{D.deleteAll} ?</DialogTitle>
        <DialogContent>
          {step === 0 && <p>{D.firstBodyDialog}</p>}
          {step === 1 && (
            <>
              <p>{D.confirmRandom}</p>
              <Box component="p" typography="headingS" fontWeight={600} textAlign="center">
                {randomText}
              </Box>
              <OutlinedInput sx={{ width: '100%' }} name="code" placeholder={randomText} />
              {error && <FormHelperText error>{error}</FormHelperText>}
            </>
          )}
          {step === 2 && (
            <>
              <p>{D.confirmId}</p>
              <OutlinedInput sx={{ width: '100%' }} name="code" />
              {error && <FormHelperText error>{error}</FormHelperText>}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button color="white" variant="contained" type="button" onClick={onCancel}>
            {D.noImNotSure}
          </Button>
          <Button variant="contained" type="submit">
            {D.yesDeleteAll}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
