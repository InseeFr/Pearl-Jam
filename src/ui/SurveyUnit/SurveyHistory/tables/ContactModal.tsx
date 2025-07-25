import { Dialog, DialogTitle, DialogContent, Button, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { Contact } from 'types/pearl';
import { FieldRow } from 'ui/FieldRow';
import D from 'i18n';

type ModifyContactModalProps = {
  open: boolean;
  modalTitle: string;
  contact?: Contact;
  onClose: () => void;
  onConfirm: (contact: Contact) => void;
};

export function ContactModal({
  open,
  modalTitle,
  contact,
  onClose,
  onConfirm,
}: ModifyContactModalProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Contact>({
    values: contact,
  });

  const handleFormSubmit = (contact: Contact) => {
    onConfirm(contact);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight={600}>
          {modalTitle}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ py: 2 }}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Stack spacing={3}>
            <FieldRow
              label={D.contactCivilite}
              name="civilite"
              control={control}
              type="radios"
              options={[
                { label: D.yes, value: 'male' },
                { label: D.no, value: 'female' },
              ]}
              required
            />
            <FieldRow
              label={D.contactLastName}
              required
              {...register('lastName', { required: true })}
            />
            <FieldRow
              label={D.contactFirstName}
              required
              {...register('firstName', { required: true })}
            />
            <FieldRow label={D.contactPhone} {...register('phoneNumber')} />
            <FieldRow label={D.contactEmail} {...register('email')} />
            <FieldRow
              label={D.contactIsMail}
              control={control}
              type="radios"
              name="isMailContact"
              options={[
                { label: D.yes, value: true },
                { label: D.no, value: false },
              ]}
            />

            <Stack spacing={2} direction="row" mt={2}>
              <Button variant="outlined" onClick={onClose} sx={{ fontWeight: 600, flexGrow: 1 }}>
                {D.cancel}
              </Button>
              <Button type="submit" variant="contained" sx={{ fontWeight: 600, flexGrow: 1 }}>
                {D.save}
              </Button>
            </Stack>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  );
}
