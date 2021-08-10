import { Link, makeStyles, Typography } from '@material-ui/core';
import { FiberManualRecord } from '@material-ui/icons';
import { SynchronizeWrapperContext } from 'components/sychronizeWrapper';
import { formatDistance } from 'date-fns';
import React, { useContext } from 'react';
import { dateFnsLocal } from 'utils';
import { NOTIFICATION_TYPE_SYNC } from 'utils/constants';
import { NavigationContext } from '../navigation/component';
import D from 'i18n';
import { NotificationWrapperContext } from 'components/notificationWrapper';

const useStyles = makeStyles(theme => ({
  root: { padding: '1em' },
  titleWrapper: {
    display: 'flex',
  },
  title: {
    color: 'black',
    fontSize: 'larger',
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

  const { id, date, title, type, messages, read, state } = data;

  const finalType = type === NOTIFICATION_TYPE_SYNC ? D.simpleSync : D.other;

  const finalDate = `${formatDistance(date || 0, new Date(), {
    addSuffix: true,
    locale: dateFnsLocal,
  })}`;

  const classes = useStyles();

  const markAsRead = () => {
    if (!read) {
      markNotifAsRead(id);
    }
    if (type === NOTIFICATION_TYPE_SYNC) {
      setOpen(false);
      setSyncResult({ date: finalDate, state, messages });
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
