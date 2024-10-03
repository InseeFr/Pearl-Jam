import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import D from 'i18n';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import {
  contactOutcomeEnum,
  getContactOutcomeByConfiguration,
} from '../../utils/enum/ContactOutcomeEnum';
import { surveyUnitStateEnum } from '../../utils/enum/SUStateEnum';
import { addNewState, persistSurveyUnit } from '../../utils/functions';
import { FieldRow } from '../FieldRow';

const defaultValue = {
  date: new Date().getTime(),
  type: undefined,
  totalNumberOfContactAttempts: 0,
};

/**
 * Form to update or create a new contact outcome
 *
 * @param {() => void} onClose
 * @param {SurveyUnit} surveyUnit
 * @returns {JSX.Element}
 */
export function ContactOutcomeForm({ onClose, surveyUnit }) {
  const { handleSubmit, control, watch } = useForm({
    defaultValues: surveyUnit.contactOutcome ?? defaultValue,
  });

  const onSubmit = handleSubmit(data => {
    // Update survey unit state
    let newState = surveyUnitStateEnum.WAITING_FOR_TRANSMISSION.type;
    if (data.type === contactOutcomeEnum.INTERVIEW_ACCEPTED.type) {
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

  const handleCancel = e => {
    e.preventDefault();
    onClose();
  };

  const contactOutcomes = useMemo(() => {
    return Object.values(
      getContactOutcomeByConfiguration(surveyUnit.contactOutcomeConfiguration)
    ).map(o => ({
      label: o.value,
      value: o.type,
    }));
  }, [surveyUnit.contactOutcomeConfiguration]);

  const [count, type] = watch(['totalNumberOfContactAttempts', 'type']);
  const isInvalid = count <= 0 || Number.isNaN(count) || !type;

  return (
    <Dialog maxWidth="s" open={true} onClose={onClose}>
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
          <Button type="button" color="white" variant="contained" onClick={handleCancel}>
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
