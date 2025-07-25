import { Dialog, DialogTitle, DialogContent, Button, Typography, Stack } from '@mui/material';
import D from 'i18n';

type DeleteConfirmationModalProps = {
  open: boolean;
  contactName?: string;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeleteConfirmationModal({
  open,
  contactName,
  onClose,
  onConfirm,
}: DeleteConfirmationModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight={600}>
          {D.deleteContactTitle}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ py: 2 }}>
        <Typography fontWeight={600} color="grey.700">
          {D.deleteContactConfirmation(contactName)}
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
