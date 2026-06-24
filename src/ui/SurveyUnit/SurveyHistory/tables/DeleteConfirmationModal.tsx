import { Dialog, DialogTitle, DialogContent, Button, Typography, Stack } from '@mui/material';
import D from 'i18n';
import { NextContactHistoryPerson } from 'types/pearl';
import { DeletePrivilegedModalAlert } from './DeletePrivilegedModalAlert';

type DeleteConfirmationModalProps = {
  open: boolean;
  selectedContact?: NextContactHistoryPerson;
  canDelete: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeleteConfirmationModal({
  open,
  selectedContact,
  canDelete,
  onClose,
  onConfirm,
}: Readonly<DeleteConfirmationModalProps>) {
  const fullName = `${selectedContact?.firstName} ${selectedContact?.lastName}`;

  if (!canDelete) {
    return <DeletePrivilegedModalAlert fullName={fullName} onClose={onClose} open={open} />;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight={600}>
          {D.deleteContactTitle}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ py: 2 }}>
        <Typography fontWeight={600} color="grey.700">
          {D.deleteContactConfirmation(fullName)}
        </Typography>
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
            onClick={onConfirm}
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
  );
}
