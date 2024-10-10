import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { Fragment, useEffect, useMemo, useState } from 'react';
import Stack from '@mui/material/Stack';
import D from 'i18n';
import { useIncrement } from '../../utils/hooks/useIncrement';
import RadioGroup from '@mui/material/RadioGroup';
import { RadioLine } from '../RadioLine';
import Box from '@mui/material/Box';
import { Typography } from '../Typography';
import { getAddressData, getprivilegedPerson, getTitle } from '../../utils/functions';
import { surveyUnitIDBService } from '../../utils/indexeddb/services/surveyUnit-idb-service';
import { COMMUNICATION_REQUEST_FORM_STEPS } from '../../utils/constants';
import { useUser } from '../../utils/hooks/useUser';
import { communicationSchema, recipientSchema, userSchema } from '../../utils/schemas';
import { ValidationError } from '../ValidationError';
import { communicationStatusEnum } from '../../utils/enum/CommunicationEnums';

const max = COMMUNICATION_REQUEST_FORM_STEPS.length - 1;

/**
 * Form to add a new contact attempt to a survey unit
 *
 * @param {() => void} onClose
 * @param {SurveyUnit} surveyUnit
 * @returns {JSX.Element}
 */
export function CommunicationForm({ onClose, surveyUnit }) {
  const {
    value: currentIndex,
    decrement,
    increment,
  } = useIncrement(
    {
      min: 0,
      max: max,
    },
    0
  );
  const [isConfirmValid, setConfirmValid] = useState(false);
  const step = COMMUNICATION_REQUEST_FORM_STEPS[currentIndex];
  /** @var {SurveyUnitCommunicationRequest} communication */
  const [communication, setCommunication] = useState({
    medium: '',
    reason: '',
    type: '',
  });

  const goPreviousStep = e => {
    e.preventDefault();
    if (step === 0) {
      onClose();
      return;
    }
    decrement();
  };

  const goNextStep = async e => {
    e.preventDefault();
    if (currentIndex === max) {
      const newCommunication = {
        ...communication,
        date: new Date().getTime(),
        emiter: 'INTERVIEWER',
        status: [{ date: new Date().getTime(), status: communicationStatusEnum.INITIATED.type }],
      };
      surveyUnitIDBService.addOrUpdateSU({
        ...surveyUnit,
        communicationRequests: [...(surveyUnit.communicationRequests ?? []), newCommunication],
      });
      onClose();
      return;
    }
    increment();
  };

  const setValue = value => {
    setCommunication({
      ...communication,
      [step.valueName]: value,
    });
  };

  const options = useMemo(() => step?.values, [step]);
  const isValid = currentIndex === max ? isConfirmValid : !!communication[step.valueName];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === max;

  return (
    <Dialog maxWidth="s" open={true} onClose={onClose}>
      <DialogTitle id="dialogtitle">{step.title}</DialogTitle>
      <DialogContent>
        <Box>
          {options && (
            <RadioGroup
              value={communication[step.valueName]}
              onChange={e => setValue(e.target.value)}
              row
              aria-labelledby="dialogtitle"
              name="communication-radio-group"
            >
              <Stack gap={1} width={1}>
                {options.map(o => (
                  <RadioLine value={o.value} key={o.value} label={o.label} disabled={o.disabled} />
                ))}
              </Stack>
            </RadioGroup>
          )}
          {isLast && (
            <CommunicationConfirmation
              communication={communication}
              surveyUnit={surveyUnit}
              onValidationChange={setConfirmValid}
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="white" variant="contained" onClick={goPreviousStep}>
          {isFirst ? D.cancelButton : D.previousButton}
        </Button>
        <Button disabled={!isValid} variant="contained" onClick={goNextStep}>
          {D.confirmButton}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/**
 * @param {SurveyUnitCommunicationRequest} communication
 * @param {SurveyUnit} surveyUnit
 * @param {(v: boolean) => void} onValidationChange
 */
function CommunicationConfirmation({ communication, surveyUnit, onValidationChange }) {
  // Extract selected labels
  const items = COMMUNICATION_REQUEST_FORM_STEPS.filter(v => v.values).map(
    v => v.values.find(value => value.value === communication[v.valueName]).label
  );
  const address = getAddressData(surveyUnit.address);
  const addressLines = Object.values(address).filter(v => !!v);
  const recipient = getprivilegedPerson(surveyUnit);
  const { user } = useUser();

  const userError = userSchema.safeParse(user).error;
  const recipientError = recipientSchema.safeParse({ ...address, ...recipient }).error;
  const communicationError = communicationSchema.safeParse(communication).error;

  useEffect(() => {
    onValidationChange(!(userError || recipientError || communicationError));
  }, []);

  return (
    <Stack gap={2} p={2} bgcolor="surfacePrimary.main" minWidth={325} borderRadius={2}>
      <div>
        <Typography variant="s" color="textTertiary" as="h3">
          {D.communicationSummaryContent}
        </Typography>
        <Box component="ul" p={0} pl={3} m={0}>
          {items.map(item => (
            <Typography
              variant="s"
              as="li"
              key={item}
              color={communicationError ? 'red' : 'textPrimary'}
            >
              {item}
            </Typography>
          ))}
        </Box>
        <ValidationError error={communicationError} mt={1} />
      </div>
      <div>
        <Typography variant="s" color="textTertiary" as="h3">
          {D.communicationSummaryRecipientAddress}
        </Typography>
        <Typography variant="s" as="p" color={recipientError ? 'red' : 'textPrimary'}>
          {getTitle(recipient.title)} {recipient.firstName} {recipient.lastName}
          <br />
          {addressLines.map(line => (
            <Fragment key={line}>
              {line}
              <br />
            </Fragment>
          ))}
        </Typography>
        <ValidationError error={recipientError} mt={1} />
      </div>
      <div>
        <Typography variant="s" color="textTertiary" as="h3">
          {D.communicationSummaryInterviewerAddress}
        </Typography>
        <Typography variant="s" as="p" color={userError ? 'red' : 'textPrimary'}>
          {user.firstName} {user.lastName}
          <br />
          {user.email}
          <br />
          {user.phoneNumber}
        </Typography>
        <ValidationError error={userError} mt={1} />
      </div>
    </Stack>
  );
}
