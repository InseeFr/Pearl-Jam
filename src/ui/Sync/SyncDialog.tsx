import { useTheme } from '@emotion/react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import WarningIcon from '@mui/icons-material/Warning';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import D from 'i18n';
import { useMemo } from 'react';
import { SyncResult } from 'types/pearl';
import { Accordion } from '../Accordion';
import { Typography } from '../Typography';
import { List, ListItem } from '@mui/material';

type CampaignNotification = {
  name: string;
  transmitted: number;
  loaded: number;
  startedWeb: string[];
  terminatedWeb: string[];
  total: number;
};
/**
 * Dialog that summarize synchronization results
 */
export function SyncDialog({
  onClose,
  syncResult,
}: Readonly<{ onClose: VoidFunction; syncResult: SyncResult }>) {
  const { state, details, messages } = syncResult;
  const campaigns: CampaignNotification[] = useMemo(() => {
    if (!details) {
      return [];
    }
    const campaignIds = new Set([
      ...Object.keys(details.transmittedSurveyUnits),
      ...Object.keys(details.loadedSurveyUnits),
    ]);

    return (
      Array.from(campaignIds)
        // Remove campaigns with no messages
        .filter(
          campaign =>
            details.transmittedSurveyUnits[campaign]?.length > 0 ||
            details.loadedSurveyUnits[campaign]?.length > 0 ||
            details.startedWeb[campaign]?.length > 0 ||
            details.terminatedWeb[campaign]?.length > 0
        )
        // Compute message into a single object
        .map(campaign => ({
          name: campaign,
          transmitted: (details.transmittedSurveyUnits[campaign] ?? []).length,
          loaded: (details.loadedSurveyUnits[campaign] ?? []).length,
          startedWeb: details.startedWeb[campaign] ?? [],
          terminatedWeb: details.terminatedWeb[campaign] ?? [],
          total:
            (details.transmittedSurveyUnits[campaign] ?? []).length +
            (details.loadedSurveyUnits[campaign] ?? []).length +
            (details.startedWeb[campaign] ?? []).length +
            (details.terminatedWeb[campaign] ?? []).length,
        }))
    );
  }, [details]);

  const showDetail = state !== 'error';

  return (
    <Dialog open onClose={close}>
      <DialogTitle>{D.syncResult}</DialogTitle>
      <DialogContent>
        <Stack gap={2}>
          <Stack gap={1}>
            {state && (
              <Typography component="p" color="textPrimary" variant="m">
                <SyncIcon
                  state={state}
                  sx={{ marginRight: 1, verticalAlign: 'middle' }}
                  fontSize="large"
                />
                {D.titleSync(state)}
              </Typography>
            )}
            {(messages as string[])?.map((message: string, index: number) => (
              <DialogContentText key={message}>
                {message}
                {state === 'warning' && index === messages.length - 1 && (
                  <Box ml={1} component="span">
                    <ThumbUpIcon color="success" fontSize="small" />
                  </Box>
                )}
              </DialogContentText>
            ))}
          </Stack>
          {showDetail && <SyncDetail campaigns={campaigns} />}
        </Stack>
      </DialogContent>
      <DialogActions>
        <div></div>
        <Button variant="contained" onClick={onClose}>
          {D.iUnderstand}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/**
 * Detail results of a synchronization campaign per campaign
 */
function SyncDetail({
  campaigns,
}: Readonly<{
  campaigns: CampaignNotification[];
}>) {
  const theme = useTheme();
  console.log({ campaigns });
  return (
    <Accordion
      defaultOpen={false}
      title={D.detailsSync}
      sx={{ background: theme.palette.surfacePrimary.main }}
      elevation={0}
    >
      {campaigns.length === 0 && <DialogContentText>{D.nothingToDisplay}</DialogContentText>}

      <List>
        {campaigns.map(campaign => (
          <Stack gap={2} key={campaign.name}>
            <>
              <ListItem>
                <Typography variant="s" color="textTertiary" component="strong" fontWeight={700}>
                  {campaign.name.toLowerCase()} :{' '}
                </Typography>{' '}
              </ListItem>
              <List disablePadding>
                {campaign.loaded > 0 && (
                  <ListItem sx={{ pl: 8 }}>{D.loadedSurveyUnits(campaign.loaded)}</ListItem>
                )}
                {campaign.transmitted > 0 && (
                  <ListItem sx={{ pl: 8 }}>{D.transmittedSurveyUnits(campaign.loaded)}</ListItem>
                )}
                {campaign.startedWeb.length > 0 && (
                  <>
                    <ListItem sx={{ pl: 8 }}>
                      {D.webInitSurveyUnit(campaign.startedWeb.length)} :{' '}
                    </ListItem>
                    <List disablePadding>
                      {campaign.startedWeb.map(id => (
                        <ListItem sx={{ pl: 16 }}>{id}</ListItem>
                      ))}
                    </List>
                  </>
                )}
                {campaign.terminatedWeb.length > 0 && (
                  <>
                    <ListItem sx={{ pl: 8 }}>
                      {D.webTerminatedSurveyUnit(campaign.terminatedWeb.length)} :{' '}
                    </ListItem>
                    <List disablePadding>
                      {campaign.terminatedWeb.map(id => (
                        <ListItem sx={{ pl: 16 }}>{id}</ListItem>
                      ))}
                    </List>
                  </>
                )}
              </List>
            </>
          </Stack>
        ))}
      </List>
    </Accordion>
  );
}

function SyncIcon({ state, ...props }: Readonly<{ state: string }>) {
  switch (state) {
    case 'error':
      return <ErrorIcon {...props} color="error" />;
    case 'warning':
      return <WarningIcon {...props} color="warning" />;
    case 'success':
      return <CheckCircleIcon {...props} color="success" />;
  }
  return null;
}
