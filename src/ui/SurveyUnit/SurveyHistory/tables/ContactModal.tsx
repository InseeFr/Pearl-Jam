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
}: Readonly<ModifyContactModalProps>) {
  const { register, handleSubmit, control } = useForm<Contact>({
    defaultValues: contact,
  });

  const handleFormSubmit = (contact: any) => {
    const verifiedContact = {
      ...contact,
      // coerce value to boolean as form will return string (or keep base value if no modification done)
      panel: contact.panel === true || contact.panel === 'true',
    };
    onConfirm(verifiedContact);
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
              label={D.contactCivilityLabel}
              control={control}
              type="radios"
              options={[
                { label: D.editContactMale, value: 'MISTER' },
                { label: D.editContactFemale, value: 'MISS' },
              ]}
              required
              {...register('title', { required: true })}
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
            <FieldRow label={D.contactPhone} {...register('phoneNumber', { pattern: /^\d+$/ })} />
            <FieldRow
              label={D.contactEmail}
              {...(register('email'), { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })}
            />
            <FieldRow
              label={D.shouldBeEmail}
              {...register('panel')}
              control={control}
              type="radios"
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
