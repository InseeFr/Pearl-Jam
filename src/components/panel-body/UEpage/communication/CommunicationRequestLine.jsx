import { Divider, makeStyles } from '@material-ui/core';
import {
  findCommunicationMediumValueByType,
  findCommunicationReasonValueByType,
  findCommunicationTypeValueByType,
} from 'utils/enum/CommunicationEnums';

import { CommunicationRequestStatus } from './CommuncationRequestStatus';
import D from 'i18n';
import MaterialIcons from 'utils/icons/materialIcons';
import Paper from '@material-ui/core/Paper';
import { getCommunicationIconFromType } from 'utils/functions/communicationFunctions';
import { getDateAttributes } from 'utils/functions/date';
import { grey } from '@material-ui/core/colors';

const useStyles = makeStyles(() => ({
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '1em',
    padding: '1em',
    backgroundColor: grey[100],
    borderRadius: '15px',
  },
  divider: {
    fontWeight: 'bold',
  },
}));

const getContentLabel = status => {
  const { type, medium, reason } = status;
  const mediumLabel = findCommunicationMediumValueByType(medium);
  const typeLabel = findCommunicationTypeValueByType(type);
  const reasonLabel = findCommunicationReasonValueByType(reason);

  return `${mediumLabel} - ${typeLabel}${reason ? ', ' + reasonLabel : ''}`;
};

const getDateLabel = date => {
  const { dayOfWeek, twoDigitdayNumber, year, month, hour, minutes } = getDateAttributes(date);
  const upcasedDayOfWeek = dayOfWeek[0].toUpperCase() + dayOfWeek.slice(1);
  return `${upcasedDayOfWeek} ${twoDigitdayNumber} ${month} ${year} ${D.at} ${hour}h${minutes}`;
};

export const CommunicationRequestLine = ({ mailRequest }) => {
  const classes = useStyles();
  const { status, emiter } = mailRequest;
  const iconType = getCommunicationIconFromType(emiter);

  const sortedStatus = status.sort((s1, s2) => s1.date > s2.date);
  const firstStatus = sortedStatus.at(0);
  const lastStatus = sortedStatus.at(-1);

  const contentLabel = getContentLabel(mailRequest);
  const dateLabel = getDateLabel(firstStatus.date);

  return (
    <Paper key={lastStatus.date} className={classes.row} elevation={0}>
      <MaterialIcons type={iconType} />
      <div>{dateLabel}</div>
      <Divider className={classes.divider} orientation="vertical" flexItem />
      <div>{contentLabel}</div>
      <CommunicationRequestStatus status={lastStatus.status} date={lastStatus.date} />
    </Paper>
  );
};
