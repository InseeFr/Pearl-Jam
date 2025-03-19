import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { MouseEvent, useState } from 'react';
import Stack from '@mui/material/Stack';
import D from 'i18n';
import RadioGroup from '@mui/material/RadioGroup';
import { RadioLine } from '../../RadioLine';
import Box from '@mui/material/Box';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import { Typography } from '../../Typography';
import { formatDate } from '../../../utils/functions/date';
import { addNewState, persistSurveyUnit } from '../../../utils/functions';
import { surveyUnitStateEnum } from '../../../utils/enum/SUStateEnum';
import { SurveyUnit } from 'types/pearl';
import Dialog from '@mui/material/Dialog';
import {
  ContactAttemptMedium,
  getMediumByConfiguration,
  getContactAttemptsByMedium,
} from 'utils/functions/contacts/ContactAttempt';

type StepValue = 'medium' | 'contactAttempt' | 'datePicker';
const steps: StepValue[] = ['medium', 'contactAttempt', 'datePicker'];

type ContactAttemptFormProps = {
  onClose: VoidFunction;
  surveyUnit: SurveyUnit;
};

/**
 * Form to add a new contact attempt to a survey unit
 */
export function ContactAttemptForm({ onClose, surveyUnit }: Readonly<ContactAttemptFormProps>) {
  const [step, setStep] = useState(steps[0]);
  const [medium, setMedium] = useState<ContactAttemptMedium>();
  const [status, setStatus] = useState<string | null>();
  const [date, setDate] = useState<Date>(new Date());

  const goPreviousStep = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const stepIndex = steps.indexOf(step);
    steps[stepIndex] === 'medium' ? onClose() : setStep(steps[stepIndex - 1]);
  };

  const goNextStep = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (step === 'datePicker') {
      const updatedSu = {
        ...surveyUnit,
        contactAttempts: [
          ...surveyUnit.contactAttempts,
          {
            status: status,
            date: date.getTime(),
            medium,
          },
        ],
      };

      const newStates = addNewState(updatedSu, surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type);
      persistSurveyUnit({
        ...updatedSu,
        states: newStates,
      });
      onClose();
      return;
    }
    const stepIndex = steps.indexOf(step);
    setStep(steps[stepIndex + 1]);
  };

  // Check if the form is valid at every step
  const isValid = () => {
    switch (step) {
      case 'medium':
        return !!medium;
      case 'contactAttempt':
        return !!status;
      case 'datePicker':
        return !!date;
    }
  };

  const isValidMedium = (medium?: ContactAttemptMedium): medium is ContactAttemptMedium => {
    return medium === 'TEL' || medium === 'EMAIL' || medium === 'FIELD';
  };

  const setValue = (value: any) => {
    if (step === 'medium' && isValidMedium(value)) {
      setMedium(value);
      setStatus(null);
    }
    if (step === 'contactAttempt') {
      setStatus(value);
    }
    if (step === 'datePicker') {
      setDate(new Date(value));
    }
  };

  const mediumOptions = getMediumByConfiguration(surveyUnit.contactAttemptConfiguration);
  const contactAttempts = getContactAttemptsByMedium(
    surveyUnit.contactAttemptConfiguration,
    medium
  );

  return (
    <Dialog maxWidth="s" open={true} onClose={onClose}>
      <DialogTitle id="dialogtitle">
        {step === 'medium' ? D.mediumQuestion : D.contactAttempt}
      </DialogTitle>
      <DialogContent>
        <Box>
          {step != 'datePicker' && (
            <RadioGroup
              value={step === 'medium' ? medium : status}
              onChange={e => setValue(e.target.value)}
              row
              aria-labelledby="dialogtitle"
              name="contact-attempt-radio-group"
            >
              {step === 'medium' && (
                <Stack gap={1} width={1}>
                  {mediumOptions.map(o => (
                    <RadioLine value={o.value} key={o.label} label={o.label} disabled={false} />
                  ))}
                </Stack>
              )}
              {step === 'contactAttempt' && (
                <Stack gap={1} width={1}>
                  {contactAttempts.map(o => (
                    <RadioLine value={o.value} key={o.value} label={o.label} disabled={false} />
                  ))}
                </Stack>
              )}
            </RadioGroup>
          )}
          {step === 'datePicker' && (
            <Stack gap={2}>
              <Typography variant="l" color="textTertiary" textAlign="center">
                {formatDate(date.getTime(), true)}
              </Typography>
              <StaticDateTimePicker
                defaultValue={date.toISOString()}
                onChange={setValue}
                ampm={false}
                ampmInClock={false}
                slots={{ toolbar: false, actionBar: 'div' }}
              />
            </Stack>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="white" variant="contained" onClick={goPreviousStep}>
          {step === 'medium' ? D.cancelButton : D.previousButton}
        </Button>
        <Button disabled={!isValid()} variant="contained" onClick={goNextStep}>
          {D.confirmButton}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
