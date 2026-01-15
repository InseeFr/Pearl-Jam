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
import { useState } from 'react';
import D from 'i18n';

type PhoneNumberPickupModalProps = {
  open: boolean;
  contactsToResolve: NextContactHistoryPersonAndImportState[];
  onClose: () => void;
  handleAdd: (newContact: NextContactHistoryPerson) => void;
};

export function PhoneNumberPickupModal({
  open,
  contactsToResolve,
  onClose,
  handleAdd,
}: Readonly<PhoneNumberPickupModalProps>) {
  const [contactsToResolveState, setContactsToResolveState] =
    useState<NextContactHistoryPersonAndImportState[]>(contactsToResolve);

  const pickContactNumber = (
    contactToUpdate: NextContactHistoryPersonAndImportState,
    phoneNumber: string
  ) => {
    const newContactsToResolveState = contactsToResolve.map(c => {
      if (c === contactToUpdate) {
        const updatedContact: NextContactHistoryPersonAndImportState = {
          resolved: true,
          nextContactHistoryPerson: { ...c.nextContactHistoryPerson, phoneNumber: phoneNumber },
          phoneNumbers: c.phoneNumbers,
        };
        console.log('updatedContact', updatedContact);

        return updatedContact;
      }

      return c;
    });

    setContactsToResolveState(newContactsToResolveState);
  };

  const validate = () => {
    contactsToResolveState?.forEach(c => handleAdd(c.nextContactHistoryPerson));
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            Titre
          </Typography>
        </DialogTitle>
        <DialogContent>
          {contactsToResolve.map(c => (
            <Stack>
              {c.phoneNumbers && (
                <Stack spacing={3}>
                  <Typography
                    fontWeight={600}
                    variant="l"
                  >{`${c.nextContactHistoryPerson.firstName} ${c.nextContactHistoryPerson.lastName}`}</Typography>
                  <FormControl fullWidth>
                    <Select
                      label="Tel"
                      defaultValue={c.nextContactHistoryPerson.phoneNumber ?? c.phoneNumbers[0]}
                      onChange={v => pickContactNumber(c, v.target.value)}
                    >
                      {c.phoneNumbers.map(phoneNumber => (
                        <MenuItem value={phoneNumber}>{phoneNumber}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              )}
              {c.resolved && !c.phoneNumbers && (
                <Typography
                  fontWeight={600}
                >{`${c.nextContactHistoryPerson.firstName} ${c.nextContactHistoryPerson.lastName} phone number is ${c.nextContactHistoryPerson.phoneNumber}`}</Typography>
              )}
            </Stack>
          ))}
        </DialogContent>
        <DialogContent sx={{ px: 3, pb: 2 }}>
          <Stack spacing={2} direction="row">
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{
                fontWeight: 600,
                flexGrow: 1,
              }}
            >
              {D.cancel}
            </Button>
            <Button
              variant="contained"
              onClick={validate}
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
