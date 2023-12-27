import D from 'i18n';
import { HEALTHY_COMMUNICATION_REQUEST_STATUS } from 'utils/constants';
import MaterialIcons from 'utils/icons/materialIcons';
import { findCommunicationStatusValueByType } from 'utils/enum/CommunicationEnums';
import { getDateAttributes } from 'utils/functions/date';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((healthy = false) => ({
  row: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '1em',
    flexGrow: '1',
  },
}));

const isHealthyStatus = status => HEALTHY_COMMUNICATION_REQUEST_STATUS.includes(status);

export const CommunicationRequestStatus = ({ status, date }) => {
  const classes = useStyles();
  const { dayOfWeek, twoDigitdayNumber, year, month } = getDateAttributes(date);
  const dateLabel = `${dayOfWeek} ${twoDigitdayNumber} ${month} ${year}`;

  const healthyStatus = isHealthyStatus(status);
  const statusValue = findCommunicationStatusValueByType(status);
  const statusLabel = `${statusValue} ${D.communicationStatusOn} ${dateLabel}`;
  return (
    <div className={classes.row}>
      <div>{statusLabel}</div>
      <MaterialIcons type={`${healthyStatus ? 'checked' : 'cross'}`} />
    </div>
  );
};
