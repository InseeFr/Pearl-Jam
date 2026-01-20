import { Dialog, DialogTitle, Typography, DialogContent, Stack, Button } from '@mui/material';
import D from 'i18n';

type DeletePrivilegedModalAlertProps = {
  fullName: string;
  open: boolean;
  onClose: () => void;
};

export const DeletePrivilegedModalAlert = ({
  fullName,
  onClose,
  open,
}: DeletePrivilegedModalAlertProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight={600}>
          {D.deleteContactTitle}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ py: 2 }}>
        <Typography fontWeight={600} color="grey.700">
          {D.deleteContactAlertPrivilegedContact(fullName)}
        </Typography>
      </DialogContent>
      <DialogContent sx={{ px: 3, pb: 2 }}>
        <Stack spacing={2} direction="row">
          <Button
            onClick={onClose}
            variant="contained"
            sx={{
              fontWeight: 600,
              flexGrow: 1,
            }}
          >
            {D.deleteContactAlertPrivilegedContactAccept}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
