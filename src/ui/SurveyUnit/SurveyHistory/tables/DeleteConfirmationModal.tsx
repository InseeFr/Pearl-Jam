import { Dialog, DialogTitle, DialogContent, Button, Typography, Stack } from '@mui/material';
import D from 'i18n';
import { NextContactHistoryPerson } from 'types/pearl';

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
  if (!canDelete) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            {D.deleteContactTitle}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ py: 2 }}>
          <Typography fontWeight={600} color="grey.700">
            Attention, pour supprimer les coordonnées de "Prénom Individu" + "Nom Individu",
            veuillez d'abord choisir un nouveau "Contact courrier" dans le tableau
          </Typography>
        </DialogContent>
        <DialogContent sx={{ px: 3, pb: 2 }}>
          <Stack spacing={2} direction="row">
            <Button
              variant="outlined"
              sx={{
                fontWeight: 600,
                flexGrow: 1,
              }}
            >
              J'ai Compris
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    );
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
          {D.deleteContactConfirmation(
            `${selectedContact?.firstName} ${selectedContact?.lastName}`
          )}
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
