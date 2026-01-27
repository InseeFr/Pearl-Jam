import { Dialog, DialogContent, Typography, Button, Stack } from '@mui/material';
import D from 'i18n';
import { Contact } from 'types/pearl';

type PreferredContactModalProps = {
  open: boolean;
  contact?: Contact;
  preferredContact?: Contact;
  onClose: () => void;
};

export function ExistingPreferedContactModal({
  contact,
  preferredContact,
  open,
  onClose,
}: Readonly<PreferredContactModalProps>) {
  if (!preferredContact) return <></>;

  const knownFullName = contact?.firstName || contact?.lastName;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        {knownFullName ? (
          <Typography>
            {`${D.contactModalPreferedContactContentMessageFirstPart} ${contact.firstName} ${contact.lastName} ${D.contactModalPreferedContactContentMessageSecondPart} ${preferredContact.firstName} ${preferredContact.lastName}.`}
          </Typography>
        ) : (
          <Typography>
            {`${D.contactModalPreferedContactContentMessageUnknownContactName} ${preferredContact.firstName} ${preferredContact.lastName}.`}
          </Typography>
        )}
        <Stack mt={2}>
          <Button variant="contained" onClick={onClose}>
            {D.contactModalPreferedContactButton}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
