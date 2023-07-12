import {
  findCommunicationMediumValueByType,
  findCommunicationReasonValueByType,
  findCommunicationTypeValueByType,
} from 'utils/enum/CommunicationEnums';

import D from 'i18n';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { getTitle } from 'utils/functions';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles(() => ({
  commRequestContent: {
    padding: '1.5em',
    margin: '1em',
    backgroundColor: '#F5F7FA',
    borderRadius: '15px',
    minWidth: '25em',
  },
  address: {
    paddingLeft: '2em',
    // fontWeight: 'bold',
  },
  error: {
    color: 'red',
  },
  lines: {
    fontWeight: 'bold',
  },
  invalidAddress: {
    border: '1px red solid',
  },
}));

export const CommunicationRequestValidation = ({
  communicationRequest,
  recipientInformation,
  userInformation,
  addressesErrors,
}) => {
  const classes = useStyles();
  const { reason, type, medium } = communicationRequest;
  const {
    civility: recipientCivility,
    recipientFirstName,
    recipientLastName,
    recipientPostcode,
    recipientCityName,
    address,
  } = recipientInformation;

  const { phoneNumber, email, civility, firstName, lastName } = userInformation;
  const { userError, recipientError, communicationRequestError } = addressesErrors;

  const mediumLabel = findCommunicationMediumValueByType(medium);
  const typeLabel = findCommunicationTypeValueByType(type);
  const reasonLabel = findCommunicationReasonValueByType(reason);

  const buildAddressFirstLine = (civility, firstname, lastName) =>
    `${getTitle(civility)} ${firstname} ${lastName}`;
  const recipientAddress = buildAddressFirstLine(
    recipientCivility,
    recipientFirstName,
    recipientLastName
  );
  const userAddress = buildAddressFirstLine(civility, firstName, lastName);
  const hasError = data => Object.values(data).some(error => error === true);

  const isUserInfoValid = !hasError(userError);
  const isRecipientInfoValid = !hasError(recipientError);

  return (
    <Paper className={classes.commRequestContent} elevation={0}>
      <Typography className={classes.lines}>{D.communicationSummaryContent}</Typography>
      <ul>
        <li>{mediumLabel}</li>
        <li>{typeLabel}</li>
        {reason && <li>{reasonLabel}</li>}
      </ul>
      <Typography className={classes.lines}>{D.communicationSummaryRecipientAddress}</Typography>
      <div className={clsx(isRecipientInfoValid ? '' : classes.invalidAddress)}>
        <Typography className={classes.address}>{recipientAddress}</Typography>
        {address
          .filter(addressLine => addressLine.length > 0)
          .map(addressLine => (
            <Typography key={addressLine} className={classes.address}>
              {addressLine}
            </Typography>
          ))}
        <Typography
          className={classes.address}
        >{`${recipientPostcode}, ${recipientCityName}`}</Typography>
      </div>
      <Typography className={classes.lines}>{D.communicationSummaryInterviewerAddress}</Typography>
      <div className={clsx(isUserInfoValid ? '' : classes.invalidAddress)}>
        <Typography> {userAddress} </Typography>
        <Typography className={classes.address}>{email}</Typography>
        <Typography className={classes.address}>{phoneNumber}</Typography>
      </div>
      <ErrorDisplayer errors={userError} prefix={D.communicationSummaryInterviewer} />
      <ErrorDisplayer errors={recipientError} prefix={D.communicationSummaryRecipient} />
      <ErrorDisplayer errors={communicationRequestError} prefix="communication-request" />
    </Paper>
  );
};

const ErrorDisplayer = ({ errors, prefix }) => {
  const classes = useStyles();
  return Object.entries(errors)
    .filter(([, val]) => val)
    .map(([key]) => (
      <Typography
        key={`${prefix}-error-${key}`}
        className={classes.error}
      >{`${prefix} : ${key}`}</Typography>
    ));
};
