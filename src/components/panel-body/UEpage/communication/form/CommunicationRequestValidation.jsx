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

  return (
    <Paper className={classes.commRequestContent} elevation={0}>
      <Typography className={classes.lines}>{D.communicationSummaryContent}</Typography>
      <ul>
        <li>{mediumLabel}</li>
        <li>{typeLabel}</li>
        {reason && <li>{reasonLabel}</li>}
      </ul>
      <Typography className={classes.lines}>{D.communicationSummaryRecipient}</Typography>
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

      <Typography className={classes.lines}>{D.communicationSummaryInterviewer}</Typography>

      <Typography className={classes.address}>{userAddress}</Typography>
      <Typography className={classes.address}>{email}</Typography>
      <Typography className={classes.address}>{phoneNumber}</Typography>
      <ErrorDisplayer errors={userError} prefix="user" />
      <ErrorDisplayer errors={recipientError} prefix="recipient" />
      <ErrorDisplayer errors={communicationRequestError} prefix="communication-request" />
    </Paper>
  );
};

const ErrorDisplayer = ({ errors, prefix }) => {
  const classes = useStyles();
  return Object.entries(errors)
    .filter(([, val]) => val)
    .map(([key, value]) => (
      <Typography
        key={`${prefix}-error-${key}`}
        className={classes.error}
      >{`${prefix}-${key} : ${value}`}</Typography>
    ));
};
