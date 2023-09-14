import React, { useContext } from 'react';
import D from 'i18n';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import IconButton from '@material-ui/core/IconButton';
import NativeSelect from '@material-ui/core/NativeSelect';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { NotificationItem } from './notificationItem';
import { NotificationWrapperContext } from 'components/notificationWrapper';
import { Delete, Drafts } from '@material-ui/icons';
import { NOTIFICATION_TYPE_MANAGEMENT, NOTIFICATION_TYPE_SYNC } from 'utils/constants';

const useStyles = makeStyles(theme => ({
  paperNotif: {
    borderRadius: '10px',
    minWidth: '400px',
    boxShadow: '3px 0 0.8em grey, -3px 0 0.8em grey',
  },
  paperNotifTitleWrapper: { display: 'flex', paddingTop: '10px' },
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
  const {
    notifications,
    unReadNotificationsNumberFilterd,
    deleteAll,
    markAllAsRead,
    filterType,
    setFilterType,
  } = useContext(NotificationWrapperContext);

  const changeFilter = e => {
    setFilterType(e.target.value);
  };

  const classes = useStyles();

  return (
    <Paper className={classes.paperNotif}>
      <div className={classes.paperNotifTitleWrapper}>
        <Typography className={classes.paperNotifTitle}>{D.notifications}</Typography>
        <div>
          <FormControl>
            <NativeSelect
              value={filterType}
              onChange={changeFilter}
              name="type"
              className={classes.selectEmpty}
              inputProps={{ 'aria-label': 'type' }}
            >
              <option value={''}>{D.allNotifs}</option>
              <option value={NOTIFICATION_TYPE_SYNC}>{D.simpleSync}</option>
              <option value={NOTIFICATION_TYPE_MANAGEMENT}>{D.notifManagement}</option>
            </NativeSelect>
            <FormHelperText>{D.notificationsType}</FormHelperText>
          </FormControl>
        </div>

        <div className={classes.iconButtons}>
          {unReadNotificationsNumberFilterd > 0 && (
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
            <React.Fragment key={notif.id}>
              <NotificationItem data={notif} />
              <Divider />
            </React.Fragment>
          ))}
        {notifications.length === 0 && (
          <Typography className={classes.noNotif}>{D.noNotification}</Typography>
        )}
      </div>
    </Paper>
  );
};
