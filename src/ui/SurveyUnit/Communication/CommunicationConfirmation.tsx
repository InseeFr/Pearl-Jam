import { Box, Button, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';
import { Fragment } from 'react';
import {
  findCommunicationMediumLabelByValue,
  findCommunicationReasonLabelByValue,
  findCommunicationTypeLabelByValue,
} from '../../../utils/enum/CommunicationEnums';
import { getAddressData, getprivilegedPerson, getTitle } from '../../../utils/functions';
import { useUser } from '../../../utils/hooks/useUser';
import { communicationSchema, recipientSchema, userSchema } from '../../../utils/schemas';
import { Typography } from '../../Typography';
import { ValidationError } from '../../ValidationError';
import { CommunicationRequestForm } from './CommunicationForm';
import D from './../../../i18n';

interface CommunicationConfirmationProps {
  surveyUnit: SurveyUnit;
  communication: CommunicationRequestForm;
  previousStep: Function;
  saveCommunicationRequest: Function;
  bypassReasonLabel: boolean;
}

const CommunicationConfirmation = ({
  communication,
  surveyUnit,
  previousStep,
  saveCommunicationRequest,
  bypassReasonLabel,
}: CommunicationConfirmationProps) => {
  const address = getAddressData(surveyUnit.address);
  const addressLines = Object.values(address).filter(v => !!v);
  const recipient = getprivilegedPerson(surveyUnit);
  const { user } = useUser();

  const userError = userSchema.safeParse(user);
  const recipientError = recipientSchema.safeParse({ ...address, ...recipient });
  const communicationError = communicationSchema.safeParse(communication);

  const isValid = userError.success && recipientError.success && communicationError.success;

  return (
    <>
      <DialogTitle id="dialogtitle">{D.communicationRequestValidation}</DialogTitle>
      <DialogContent>
        <Box>
          <Stack gap={2} p={2} bgcolor="surfacePrimary.main" minWidth={325} borderRadius={2}>
            <div>
              <Typography variant="s" color="textTertiary" as="h3">
                {D.communicationSummaryContent}
              </Typography>
              <Box component="ul" p={0} pl={3} m={0}>
                <Typography
                  variant="s"
                  as="li"
                  color={communicationError.success ? 'textPrimary' : 'error'}
                >
                  {findCommunicationMediumLabelByValue(communication.medium)}{' '}
                </Typography>
                <Typography
                  variant="s"
                  as="li"
                  color={communicationError.success ? 'textPrimary' : 'error'}
                >
                  {findCommunicationTypeLabelByValue(communication.type)}{' '}
                </Typography>
                {!bypassReasonLabel && (
                  <Typography
                    variant="s"
                    as="li"
                    color={communicationError.success ? 'textPrimary' : 'error'}
                  >
                    {findCommunicationReasonLabelByValue(communication.reason)}
                  </Typography>
                )}
              </Box>
              {!communicationError.success && (
                <ValidationError error={communicationError.error} mt={1} />
              )}
            </div>
            <div>
              <Typography variant="s" color="textTertiary" as="h3">
                {D.communicationSummaryRecipientAddress}
              </Typography>
              <Typography
                variant="s"
                as="p"
                color={recipientError.success ? 'textPrimary' : 'error'}
              >
                {getTitle(recipient.title)} {recipient.firstName} {recipient.lastName}
                <br />
                {addressLines.map(line => (
                  <Fragment key={line.toString()}>
                    {line}
                    <br />
                  </Fragment>
                ))}
              </Typography>
              {!recipientError.success && <ValidationError error={recipientError.error} mt={1} />}
            </div>
            <div>
              <Typography variant="s" color="textTertiary" as="h3">
                {D.communicationSummaryInterviewerAddress}
              </Typography>
              <Typography variant="s" as="p" color={userError.success ? 'textPrimary' : 'error'}>
                {user.firstName} {user.lastName}
                <ol />
                {user.email}
                <ol />
                {user.phoneNumber}
              </Typography>
              {!userError.success && <ValidationError error={userError.error} mt={1} />}
            </div>
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" variant="contained" onClick={() => previousStep()}>
          {D.previousButton}
        </Button>
        <Button variant="contained" onClick={() => saveCommunicationRequest()} disabled={!isValid}>
          {D.confirmButton}
        </Button>
      </DialogActions>
    </>
  );
};

export default CommunicationConfirmation;
