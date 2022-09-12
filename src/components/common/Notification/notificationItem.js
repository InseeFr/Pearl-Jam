import { NOTIFICATION_TYPE_MANAGEMENT, NOTIFICATION_TYPE_SYNC } from 'utils/constants';
import React, { useContext } from 'react';

import D from 'i18n';
import FiberManualRecord from '@material-ui/icons/FiberManualRecord';
import Link from '@material-ui/core/Link';
import { NavigationContext } from '../navigation/component';
import { NotificationWrapperContext } from 'components/notificationWrapper';
import { SynchronizeWrapperContext } from 'components/sychronizeWrapper';
import Typography from '@material-ui/core/Typography';
import { dateFnsLocal } from 'utils';
import { formatDistance } from 'date-fns';
import { makeStyles } from '@material-ui/core/styles';
import syncReportIdbService from 'utils/indexeddb/services/syncReport-idb-service';

const useStyles = makeStyles(theme => ({
  root: { padding: '1em' },
  titleWrapper: {
    display: 'flex',
  },
  title: {
    color: 'black',
    fontSize: 'larger',
    textAlign: 'left',
  },
  details: {
    fontSize: '0.8em',
    textTransform: 'uppercase',
    color: 'grey',
  },
  readIcon: { marginLeft: 'auto', color: '#0f417a' },
}));

export const NotificationItem = ({ data }) => {
  const { markNotifAsRead } = useContext(NotificationWrapperContext);
  const { setOpen } = useContext(NavigationContext);
  const { setSyncResult } = useContext(SynchronizeWrapperContext);

  const { id, date, title, type, messages, read, state, detail } = data;

  const typeOfNotif = {
    [NOTIFICATION_TYPE_SYNC]: D.simpleSync,
    [NOTIFICATION_TYPE_MANAGEMENT]: D.notifManagement,
  };
  const finalType = typeOfNotif[type];

  const finalDate = `${formatDistance(date || 0, new Date(), {
    addSuffix: true,
    locale: dateFnsLocal,
  })}`;

  const classes = useStyles();

  const markAsRead = async () => {
    if (!read) {
      markNotifAsRead(id);
    }
    if (type === NOTIFICATION_TYPE_SYNC) {
      const report = (await syncReportIdbService.getById(detail)) || {};
      setOpen(false);
      setSyncResult({ date: finalDate, state, messages, details: report });
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.titleWrapper}>
        <Link component="button" className={classes.title} onClick={markAsRead}>
          {title}
        </Link>
        {!read && <FiberManualRecord className={classes.readIcon} />}
      </div>
      <Typography className={classes.details}>{`${finalDate} - ${finalType}`}</Typography>
    </div>
  );
};
