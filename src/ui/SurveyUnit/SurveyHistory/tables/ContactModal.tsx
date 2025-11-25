import { Dialog, DialogTitle, DialogContent, Button, Stack, Typography } from '@mui/material';
import { DefaultValues, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NextContactHistoryPerson } from 'types/pearl';
import { FieldRow } from 'ui/FieldRow';
import D from 'i18n';
import { ContactFormData, contactSchema } from 'utils/schemas/nextContactSchema';
import { useEffect } from 'react';

type ModifyContactModalProps = {
  open: boolean;
  modalTitle: string;
  contact?: NextContactHistoryPerson;
  onClose: () => void;
  onConfirm: (contact: NextContactHistoryPerson) => void;
};

export function ContactModal({
  open,
  modalTitle,
  contact,
  onClose,
  onConfirm,
}: Readonly<ModifyContactModalProps>) {
  const defaultValues = {
    title: contact?.title ?? 'MISTER',
    firstName: contact?.firstName ?? '',
    lastName: contact?.lastName ?? '',
    phoneNumber: contact?.phoneNumber ?? '',
    email: contact?.email ?? '',
    preferredContact: contact?.preferredContact ? 'true' : 'false',
  } as const;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    mode: 'onSubmit',
    defaultValues: defaultValues,
    reValidateMode: 'onBlur',
  });

  useEffect(() => {
    if (contact) {
      reset({
        title: contact.title,
        lastName: contact.lastName || '',
        firstName: contact.firstName || '',
        phoneNumber: contact.phoneNumber || '',
        email: contact.email || '',
        preferredContact: contact?.preferredContact ? 'true' : 'false',
      });
    }
  }, [contact, reset]);

  const handleFormSubmit = (formData: ContactFormData) => {
    onConfirm(formData);
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight={600}>
          {modalTitle}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ py: 2 }}>
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
          <Stack spacing={3}>
            <FieldRow
              label={D.contactCivilityLabel}
              control={control}
              type="radios"
              helperText={errors.title?.message}
              errors={errors}
              options={[
                { label: D.editContactMale, value: 'MISTER' },
                { label: D.editContactFemale, value: 'MISS' },
              ]}
              required
              {...register('title')}
            />
            <FieldRow
              label={D.contactLastName}
              helperText={errors.lastName?.message}
              errors={errors}
              required
              {...register('lastName')}
            />
            <FieldRow
              helperText={errors.firstName?.message}
              errors={errors}
              label={D.contactFirstName}
              required
              {...register('firstName')}
            />
            <FieldRow
              label={D.contactPhone}
              helperText={errors.phoneNumber?.message}
              errors={errors}
              {...register('phoneNumber')}
            />
            <FieldRow
              label={D.contactEmail}
              helperText={errors.email?.message}
              errors={errors}
              {...register('email')}
            />

            <FieldRow
              label={D.shouldBeEmail}
              control={control}
              name="preferredContact"
              type="radios"
              options={[
                { label: D.yes, value: 'true' },
                { label: D.no, value: 'false' },
              ]}
            />

            <Stack spacing={2} direction="row" mt={2}>
              <Button
                variant="outlined"
                onClick={handleClose}
                sx={{ fontWeight: 600, flexGrow: 1 }}
              >
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
