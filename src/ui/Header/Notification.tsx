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
import { Notification as NotificationType, SyncResultDetails } from 'types/pearl';
import { dateFnsLocal } from '../../utils';
import { NOTIFICATION_TYPE_SYNC } from '../../utils/constants';
import { deleteNotification, markNotificationAsRead } from '../../utils/hooks/useNotifications';
import syncReportIdbService from '../../utils/indexeddb/services/syncReport-idb-service';
import { Row } from '../Row';
import { SyncContext } from '../Sync/SyncContextProvider';
import { Typography } from '../Typography';
import { DialogContentText, List, ListItem } from '@mui/material';
import { NavLink } from 'react-router-dom';

interface NotificationProps {
  notification: NotificationType;
  onExit: VoidFunction;
  defaultExpanded: boolean;
}

export function Notification({
  notification,
  onExit,
  defaultExpanded,
}: Readonly<NotificationProps>) {
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
      defaultExpanded={defaultExpanded}
      elevation={0}
      disableGutters
      variant="dense"
      color="accent"
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
            <Typography component="p" variant="s" key={message}>
              {message}
            </Typography>
          ))}
          <NotificationDetails details={notification.details} />
          <Button sx={{ alignSelf: 'flex-end' }} color="textPrimary" onClick={handleDelete}>
            <DeleteOutlineIcon />
            {D.delete}
          </Button>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}

const SurveyUnitList = ({
  surveyUnits,
  message,
}: Readonly<{ surveyUnits?: string[]; message: (su: number) => string }>) => {
  const { setNotificationOpened } = useContext(SyncContext);
  if (!surveyUnits || surveyUnits.length === 0) return null;

  return (
    <>
      <ListItem sx={{ pl: 4, pt: 0 }}>
        <DialogContentText>{message(surveyUnits.length)}: </DialogContentText>
      </ListItem>
      <List sx={{ pl: 4 }}>
        {surveyUnits.map(su => (
          <ListItem key={su} sx={{ pl: 4, pt: 0 }}>
            <DialogContentText>
              <NavLink
                onClick={() => setNotificationOpened(false)}
                to={`/survey-unit/${su}/details`}
              >
                {su}
              </NavLink>
            </DialogContentText>
          </ListItem>
        ))}
      </List>
    </>
  );
};

const NotificationDetails = ({ details }: { details?: SyncResultDetails }) => {
  if (!details) return null;

  const { loadedSurveyUnits, transmittedSurveyUnits, startedWeb, terminatedWeb } = details;
  const campaigns = new Set([
    ...Object.keys(loadedSurveyUnits),
    ...Object.keys(transmittedSurveyUnits),
    ...Object.keys(startedWeb),
    ...Object.keys(terminatedWeb),
  ]);

  if (campaigns.size === 0) return null;

  return (
    <List>
      {Array.from(campaigns)
        .filter(
          hasAtLeastOnSurveyUnitToDisplay(
            loadedSurveyUnits,
            transmittedSurveyUnits,
            startedWeb,
            terminatedWeb
          )
        )
        .map(campaign => (
          <Stack key={campaign} gap={2}>
            <>
              <ListItem sx={{ pl: 0 }}>
                <DialogContentText>{campaign.toLowerCase()} : </DialogContentText>{' '}
              </ListItem>
              <List disablePadding>
                <SurveyUnitList
                  surveyUnits={loadedSurveyUnits[campaign]}
                  message={D.loadedSurveyUnits}
                />
                <SurveyUnitList
                  surveyUnits={transmittedSurveyUnits[campaign]}
                  message={D.transmittedSurveyUnits}
                />
                <SurveyUnitList surveyUnits={startedWeb[campaign]} message={D.webInitSurveyUnit} />
                <SurveyUnitList
                  surveyUnits={terminatedWeb[campaign]}
                  message={D.webTerminatedSurveyUnit}
                />
              </List>
            </>
          </Stack>
        ))}
    </List>
  );
};

function hasAtLeastOnSurveyUnitToDisplay(
  loadedSurveyUnits: Record<string, string[]>,
  transmittedSurveyUnits: Record<string, string[]>,
  startedWeb: Record<string, string[]>,
  terminatedWeb: Record<string, string[]>
): (value: string, index: number, array: string[]) => unknown {
  return campaign =>
    [
      ...(loadedSurveyUnits[campaign] || []),
      ...(transmittedSurveyUnits[campaign] || []),
      ...(startedWeb[campaign] || []),
      ...(terminatedWeb[campaign] || []),
    ].length > 0;
}
