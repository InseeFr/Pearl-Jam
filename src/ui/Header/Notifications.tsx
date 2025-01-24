import DeleteIcon from '@mui/icons-material/Delete';
import MarkAsReadIcon from '@mui/icons-material/MarkAsUnread';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useState } from 'react';
import D from '../../i18n/build-dictionary';
import { NOTIFICATION_TYPE_MANAGEMENT, NOTIFICATION_TYPE_SYNC } from '../../utils/constants';
import {
  deleteNotifications,
  markNotificationsAsRead,
  useNotifications,
} from '../../utils/hooks/useNotifications';
import { Row } from '../Row';
import { Typography } from '../Typography';
import { HeaderBackdrop } from './HeaderBackdrop';
import { Notification } from './Notification';

interface NotificationsTypes {
  target: HTMLElement;
  onClose: VoidFunction;
}

export function Notifications({ target, onClose }: Readonly<NotificationsTypes>) {
  const open = !!target;
  const { notifications } = useNotifications();
  const theme = useTheme();
  const [type, setType] = useState(null);

  const filteredNotifications = type
    ? notifications.filter(notification => notification.type === type)
    : notifications;

  return (
    <>
      <Popover
        id="basic-menu"
        anchorEl={target}
        open={open}
        onClose={onClose}
        aria-labelledby="notifications-button"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        sx={{ marginTop: theme.spacing(2) }}
        slotProps={{
          paper: {
            elevation: 3,
            sx: {
              width: 690,
              borderRadius: 2,
            },
          },
        }}
      >
        <Stack gap={2} p={3}>
          <Row justifyContent="space-between">
            <Typography variant="headingM">{D.notifications}</Typography>
            <Row gap={1}>
              <IconButton
                color="textPrimary"
                title={D.markAllAsRead}
                onClick={markNotificationsAsRead}
              >
                <MarkAsReadIcon />
              </IconButton>
              <IconButton color="textPrimary" title={D.deleteAll} onClick={deleteNotifications}>
                <DeleteIcon />
              </IconButton>
            </Row>
          </Row>
          <Tabs
            value={type}
            onChange={(_, type) => setType(type)}
            aria-label="Type de notification"
            textColor="secondary"
          >
            <Tab label={D.allNotifications} value={null} />
            <Tab label={D.technicalNotifications} value={NOTIFICATION_TYPE_SYNC} />
            <Tab label={D.businessNotifications} value={NOTIFICATION_TYPE_MANAGEMENT} />
          </Tabs>
          <Stack gap={1}>
            {filteredNotifications.map(notification => (
              <Notification key={notification.id} notification={notification} onExit={onClose} />
            ))}
          </Stack>
        </Stack>
      </Popover>
      <HeaderBackdrop open={open} />
    </>
  );
}
