import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { MouseEvent, useMemo, useState } from 'react';
import Stack from '@mui/material/Stack';
import D from 'i18n';
import { useIncrement } from '../../../utils/hooks/useIncrement';
import { getMediumByConfiguration } from '../../../utils/enum/MediumEnum';
import RadioGroup from '@mui/material/RadioGroup';
import { RadioLine } from '../../RadioLine';
import Box from '@mui/material/Box';
import { getContactAttemptByConfiguration } from '../../../utils/enum/ContactAttemptEnum';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import { Typography } from '../../Typography';
import { formatDate } from '../../../utils/functions/date';
import { addNewState, persistSurveyUnit } from '../../../utils/functions';
import { surveyUnitStateEnum } from '../../../utils/enum/SUStateEnum';
import { SurveyUnit } from 'types/pearl';
import Dialog from '@mui/material/Dialog';

const getTitle = (step: number) => {
  switch (step) {
    case 1:
      return D.selectCommunciationRequestMedium;
    case 2:
      return D.contactAttempt;
    case 3:
      return D.datePicking;
  }
};

interface ContactAttemptFormProps {
  onClose: () => void;
  surveyUnit: SurveyUnit;
}
/**
 * Form to add a new contact attempt to a survey unit
 */
export function ContactAttemptForm({ onClose, surveyUnit }: Readonly<ContactAttemptFormProps>) {
  const {
    value: step,
    increment,
    decrement,
  } = useIncrement(
    {
      min: 1,
      max: 3,
    },
    1
  );
  const [medium, setMedium] = useState<string | null>('');
  const [status, setStatus] = useState<string | null>('');
  const [date, setDate] = useState<Date>(new Date());

  const goPreviousStep = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (step === 1) {
      onClose();
      return;
    }
    decrement();
  };

  const goNextStep = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (step === 3) {
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
    increment();
  };

  // Check if the form is valid at every step
  const isValid = () => {
    switch (step) {
      case 1:
        return !!medium;
      case 2:
        return !!status;
      case 3:
        return !!date;
    }
    return false;
  };

  const setValue = (value: string | null) => {
    if (step === 1) {
      setMedium(value);
      setStatus('');
    }
    if (step === 2) {
      setStatus(value);
    }
    if (step === 3) {
      setDate(new Date(value!));
    }
  };

  const options = useMemo(() => {
    switch (step) {
      case 1:
        return Object.values(getMediumByConfiguration(surveyUnit.contactAttemptConfiguration));
      case 2:
        return Object.values(
          getContactAttemptByConfiguration(surveyUnit.contactAttemptConfiguration, medium)
        );
      default:
        return [];
    }
  }, [step, surveyUnit.contactAttemptConfiguration]);
  const isRadioStep = step !== 3;
  return (
    <Dialog maxWidth="s" open={true} onClose={onClose}>
      <DialogTitle id="dialogtitle">{getTitle(step)}</DialogTitle>
      <DialogContent>
        <Box>
          {isRadioStep && (
            <RadioGroup
              value={step === 1 ? medium : status}
              onChange={e => setValue(e.target.value)}
              row
              aria-labelledby="dialogtitle"
              name="contact-attempt-radio-group"
            >
              <Stack gap={1} width={1}>
                {options.map(o => (
                  <RadioLine value={o.type} key={o.type} label={o.value} disabled={false} />
                ))}
              </Stack>
            </RadioGroup>
          )}
          {step === 3 && (
            <Stack gap={2}>
              <Typography variant="l" color="textTertiary" textAlign="center">
                {formatDate(date.getTime(), true)}
              </Typography>
              <StaticDateTimePicker
                defaultValue={date}
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
          {step === 1 ? D.cancelButton : D.previousButton}
        </Button>
        <Button disabled={!isValid()} variant="contained" onClick={goNextStep}>
          {D.confirmButton}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
