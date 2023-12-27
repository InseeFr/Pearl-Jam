import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import DialogContentText from '@mui/material/DialogContentText';
import D from 'i18n';
import React, { useMemo } from 'react';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Accordion } from '../Accordion';
import { theme } from '../PearlTheme';
import { Typography } from '../Typography';
import ErrorIcon from '@mui/icons-material/Error';

/**
 * Dialog that summarize synchronization results
 *
 * @param {() => void} onClose
 * @param {SyncResult} syncResult
 */
export function SyncDialog({ onClose, syncResult }) {
  const { state, details, messages } = syncResult;
  const campaigns = useMemo(() => {
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
            details.transmittedSurveyUnits[campaign]?.length ||
            details.loadedSurveyUnits[campaign]?.length
        )
        // Compute message into a single object
        .map(campaign => ({
          name: campaign,
          transmitted: (details.transmittedSurveyUnits[campaign] ?? []).length,
          loaded: (details.loadedSurveyUnits[campaign] ?? []).length,
          total:
            (details.transmittedSurveyUnits[campaign] ?? []).length +
            (details.loadedSurveyUnits[campaign] ?? []).length,
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
              <Typography as="p" color="textPrimary" variant="m">
                <SyncIcon
                  state={state}
                  sx={{ marginRight: 1, verticalAlign: 'middle' }}
                  fontSize="large"
                />
                {D.titleSync(state)}
              </Typography>
            )}
            {messages?.map((message, index) => (
              <DialogContentText key={index}>
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
 * @param {{name: string, transmitted: number, loaded: number, total: number}[]} campaigns
 * @returns {JSX.Element}
 * @constructor
 */
function SyncDetail({ campaigns }) {
  return (
    <Accordion
      defaultOpen={false}
      title={D.detailsSync}
      sx={{ background: theme.palette.surfacePrimary.main }}
      elevation={0}
    >
      {campaigns.length === 0 && <DialogContentText>{D.nothingToDisplay}</DialogContentText>}
      {campaigns.map(campaign => (
        <Stack gap={2}>
          {campaign.total === 0 && <DialogContentText>{D.nothingToDisplay}</DialogContentText>}
          {campaign.loaded > 0 && (
            <DialogContentText>
              <Typography variant="s" color="textTertiary" as="strong" fontWeight={700}>
                {campaign.name.toLowerCase()} :{' '}
              </Typography>{' '}
              {D.loadedSurveyUnits(campaign.loaded)}
            </DialogContentText>
          )}
          {campaign.transmitted > 0 && (
            <DialogContentText>
              <Typography variant="s" color="textTertiary" as="strong" fontWeight={700}>
                {campaign.name.toLowerCase()} :{' '}
              </Typography>{' '}
              {D.transmittedSurveyUnits(campaign.loaded)}
            </DialogContentText>
          )}
        </Stack>
      ))}
    </Accordion>
  );
}

/**
 * @param {string} state
 */
function SyncIcon({ state, ...props }) {
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
