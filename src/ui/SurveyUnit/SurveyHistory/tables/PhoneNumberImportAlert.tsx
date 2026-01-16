import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Stack,
  Typography,
  MenuItem,
  Select,
  FormControl,
} from '@mui/material';
import { NextContactHistoryPerson } from 'types/pearl';
import { NextContactHistoryPersonAndImportState } from './NextContactsTable';
import { useEffect, useState } from 'react';
import D from 'i18n';

type PhoneNumberImportAlertProps = {
  open: boolean;
  contactsToResolve: NextContactHistoryPersonAndImportState[];
  onClose: () => void;
};

export function PhoneNumberImportAlert({
  open,
  contactsToResolve,
  onClose,
}: Readonly<PhoneNumberImportAlertProps>) {
  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            Impossible d'importer
          </Typography>
        </DialogTitle>
        <DialogContent>
          {contactsToResolve.map(c => (
            <Stack>
              {!c.resolved && (
                <Typography
                  fontWeight={600}
                  variant="m"
                >{`Veuillez selectionner un seul numéro de téléphone favori pour ${c.nextContactHistoryPerson.firstName} ${c.nextContactHistoryPerson.lastName}.`}</Typography>
              )}
            </Stack>
          ))}
        </DialogContent>
        <DialogContent sx={{ px: 3, pb: 2 }}>
          <Stack spacing={2} direction="row">
            <Button
              variant="contained"
              onClick={onClose}
              sx={{
                fontWeight: 600,
                flexGrow: 1,
              }}
            >
              {D.confirm}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}
