import Popover from '@mui/material/Popover';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { useContext, useState } from 'react';
import { Typography } from '../Typography';
import { HeaderBackdrop } from './HeaderBackdrop';
import {
  deleteNotification,
  deleteNotifications,
  markNotificationAsRead,
  markNotificationsAsRead,
  useNotifications,
} from '../../utils/hooks/useNotifications';
import { Row } from '../Row';
import { formatDistance } from 'date-fns';
import { dateFnsLocal } from '../../utils';
import BuildIcon from '@mui/icons-material/Build';
import { useTheme } from '@mui/material/styles';
import { NOTIFICATION_TYPE_MANAGEMENT, NOTIFICATION_TYPE_SYNC } from '../../utils/constants';
import syncReportIdbService from '../../utils/indexeddb/services/syncReport-idb-service';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import Badge from '@mui/material/Badge';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { SyncContext } from '../Sync/SyncContextProvider';
import IconButton from '@mui/material/IconButton';
import D from '../../i18n/build-dictionary';
import DeleteIcon from '@mui/icons-material/Delete';
import MarkAsReadIcon from '@mui/icons-material/MarkAsUnread';

export function Notifications({ target, onClose }) {
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
            <Typography variant="headingM">Notifications</Typography>
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
            <Tab label="Toutes les notifications" value={null} />
            <Tab label="Notification techniques" value={NOTIFICATION_TYPE_SYNC} />
            <Tab label="Notifications Métiers" value={NOTIFICATION_TYPE_MANAGEMENT} />
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

function Notification({ notification, onExit }) {
  const theme = useTheme();
  const date = `${formatDistance(notification.date || 0, new Date(), {
    addSuffix: true,
    locale: dateFnsLocal,
  })}`;
  const { setSyncResult } = useContext(SyncContext);

  const handleOpen = async e => {
    e.preventDefault();
    e.stopPropagation();
    if (notification.type === NOTIFICATION_TYPE_SYNC) {
      const report = await syncReportIdbService.getById(notification.id);
      setSyncResult({
        date: date,
        state: notification.state,
        messages: notification.message,
        details: report,
      });
      onExit();
    }
  };

  const handleExpand = (_, expanded) => {
    if (!notification.read && expanded) {
      markNotificationAsRead(notification);
    }
  };

  const handleDelete = () => deleteNotification(notification);

  const isRead = notification.read;
  const badge = notification.state === 'error' ? '!' : undefined;
  const background = isRead ? undefined : theme.palette.surfaceTertiary.main;
  const isSyncNotification = notification.type === NOTIFICATION_TYPE_SYNC;

  return (
    <Accordion
      elevation={0}
      disableGutters
      variant="dense"
      bgcolor="accent"
      onChange={handleExpand}
    >
      <AccordionSummary
        sx={{ padding: 0, background: background, borderRadius: 2 }}
        expandIcon={<ExpandMoreIcon fontSize="large" color="textPrimary" />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Row justifyContent="space-between">
          <Row gap={1}>
            <Box p={2}>
              <Badge badgeContent={badge} color="accent">
                {isSyncNotification ? <BuildIcon /> : <SupportAgentIcon />}
              </Badge>
            </Box>
            <Stack gap={0.5} paddingBlock={1}>
              <Link href="#" underline={isSyncNotification ? 'hover' : 'none'} onClick={handleOpen}>
                <Typography color="black" variant="s" fontWeight={700}>
                  {notification.title}
                </Typography>
              </Link>
              <Typography color="textTertiary" variant="s">
                {date}
              </Typography>
            </Stack>
          </Row>
        </Row>
      </AccordionSummary>
      <AccordionDetails>
        <Stack gap={1}>
          {notification.messages.map(message => (
            <Typography as="p" variant="s" key={message}>
              {message}
            </Typography>
          ))}
          <Button sx={{ alignSelf: 'flex-end' }} color="textPrimary" onClick={handleDelete}>
            <DeleteOutlineIcon />
            Supprimer
          </Button>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
