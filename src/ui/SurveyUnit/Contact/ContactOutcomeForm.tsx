import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useMemo } from 'react';
import Stack from '@mui/material/Stack';
import D from 'i18n';
import { useForm } from 'react-hook-form';
import { SurveyUnit } from 'types/pearl';
import { surveyUnitStateEnum } from 'utils/enum/SUStateEnum';
import { FieldRow } from 'ui/FieldRow';
import {
  contactOutcomeEnum,
  getContactOutcomeByConfiguration,
} from 'utils/enum/ContactOutcomeEnum';
import { addNewState, persistSurveyUnit } from 'utils/functions';

const defaultValue = {
  date: new Date().getTime(),
  type: undefined,
  totalNumberOfContactAttempts: 0,
};

interface ContactOutcomeFormProps {
  onClose: VoidFunction;
  surveyUnit: SurveyUnit;
}

/**
 * Form to update or create a new contact outcome
 */
export function ContactOutcomeForm({ onClose, surveyUnit }: Readonly<ContactOutcomeFormProps>) {
  const { handleSubmit, control, watch } = useForm({
    defaultValues: surveyUnit.contactOutcome ?? defaultValue,
  });

  const onSubmit = handleSubmit(data => {
    // Update survey unit state
    let newState: string = surveyUnitStateEnum.WAITING_FOR_TRANSMISSION.type;
    if (data.type === contactOutcomeEnum.INTERVIEW_ACCEPTED.value) {
      newState = surveyUnitStateEnum.APPOINTMENT_MADE.type;
    }
    const newStates = addNewState(surveyUnit, newState);
    persistSurveyUnit({
      ...surveyUnit,
      states: newStates,
      contactOutcome: data,
    });
    onClose();
  });

  const handleCancel = () => {
    onClose();
  };

  const contactOutcomes = useMemo(() => {
    return Object.values(
      getContactOutcomeByConfiguration(
        surveyUnit.contactOutcomeConfiguration,
        surveyUnit.contactOutcome?.type
      )
    ).map(o => ({
      label: o.label,
      value: o.value,
    }));
  }, [surveyUnit.contactOutcomeConfiguration]);

  const [count] = watch(['totalNumberOfContactAttempts']);
  const isInvalid = count <= 0 || Number.isNaN(count);

  return (
    <Dialog open={true} onClose={onClose}>
      <form action="" onSubmit={onSubmit}>
        <DialogTitle>{D.contactOutcome}</DialogTitle>
        <DialogContent>
          <Stack gap={2}>
            <FieldRow control={control} type="radiostack" options={contactOutcomes} name="type" />
            <FieldRow
              label={D.totalNumberOfContactAttempts}
              control={control}
              type="increment"
              options={contactOutcomes}
              name="totalNumberOfContactAttempts"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button type="button" color="primary" variant="contained" onClick={handleCancel}>
            {D.cancelButton}
          </Button>
          <Button disabled={isInvalid} variant="contained" type="submit">
            {D.saveButton}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
