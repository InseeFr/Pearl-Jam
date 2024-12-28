import BuildIcon from '@mui/icons-material/Build';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { formatDistance } from 'date-fns';
import D from 'i18n';
import { MouseEvent, useContext } from 'react';
import { Notification as NotificationType } from 'types/pearl';
import { dateFnsLocal } from '../../utils';
import { NOTIFICATION_TYPE_SYNC } from '../../utils/constants';
import { deleteNotification, markNotificationAsRead } from '../../utils/hooks/useNotifications';
import syncReportIdbService from '../../utils/indexeddb/services/syncReport-idb-service';
import { Row } from '../Row';
import { SyncContext } from '../Sync/SyncContextProvider';
import { Typography } from '../Typography';

interface NotificationProps {
  notification: NotificationType;
  onExit: () => void;
}

export function Notification({ notification, onExit }: Readonly<NotificationProps>) {
  const theme = useTheme();
  const date = `${formatDistance(notification.date || 0, new Date(), {
    addSuffix: true,
    locale: dateFnsLocal,
  })}`;
  const { setSyncResult } = useContext(SyncContext)!;
  const handleOpen = async (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (notification.type === NOTIFICATION_TYPE_SYNC) {
      const report = await syncReportIdbService.getById(notification.id);
      setSyncResult({
        date: date,
        state: notification.state,
        messages: notification.message!,
        details: report,
      });
      onExit();
    }
  };

  const handleExpand = (_: unknown, expanded: boolean) => {
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
            {D.delete}
          </Button>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
