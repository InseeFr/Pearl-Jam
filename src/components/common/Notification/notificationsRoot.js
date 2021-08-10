import React, { useContext } from 'react';
import D from 'i18n';
import { Divider, IconButton, makeStyles, Paper, Tooltip, Typography } from '@material-ui/core';
import { NotificationItem } from './notificationItem';
import { NotificationWrapperContext } from 'components/notificationWrapper';
import { Delete, Drafts } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  paperNotif: {
    borderRadius: '10px',
    minWidth: '400px',
    boxShadow: '3px 0 0.8em grey, -3px 0 0.8em grey',
  },
  paperNotifTitleWrapper: { display: 'flex' },
  iconButtons: { marginLeft: 'auto' },
  paperNotifTitle: {
    padding: '1em',
    fontWeight: 'bold',
  },
  noNotif: { padding: '1em' },
  paperNotifContent: {
    padding: 0,
    maxHeight: '400px',
    maxWidth: '400px',
    overflowY: 'auto',
  },
}));

export const NotificationsRoot = () => {
  const { notifications, unReadNotificationsNumber, deleteAll, markAllAsRead } = useContext(
    NotificationWrapperContext
  );

  const classes = useStyles();

  return (
    <Paper className={classes.paperNotif}>
      <div className={classes.paperNotifTitleWrapper}>
        <Typography className={classes.paperNotifTitle}>{D.notifications}</Typography>
        <div className={classes.iconButtons}>
          {unReadNotificationsNumber > 0 && (
            <Tooltip title={D.markAllAsRead}>
              <IconButton aria-label={D.markAllAsRead} onClick={markAllAsRead}>
                <Drafts />
              </IconButton>
            </Tooltip>
          )}
          {notifications.length > 0 && (
            <Tooltip title={D.deleteAll}>
              <IconButton aria-label={D.deleteAll} onClick={deleteAll}>
                <Delete />
              </IconButton>
            </Tooltip>
          )}
        </div>
      </div>

      <Divider />
      <div className={classes.paperNotifContent}>
        {notifications.length > 0 &&
          notifications.map(notif => (
            <>
              <NotificationItem data={notif} />
              <Divider />
            </>
          ))}
        {notifications.length === 0 && (
          <Typography className={classes.noNotif}>{D.noNotification}</Typography>
        )}
      </div>
    </Paper>
  );
};
