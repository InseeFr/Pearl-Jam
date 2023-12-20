import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Typography } from '../ui/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import { useSurveyUnits } from '../utils/hooks/database';
import { CampaignProgress } from '../ui/Stats/CampaignProgress';
import { useMemo } from 'react';
import { groupBy } from '../utils/functions/array';
import { CampaignProgressPieChart } from '../ui/Stats/CampaignProgressPieChart';

export function SuiviPage() {
  const surveyUnits = useSurveyUnits();
  const surveyUnitsPerCampaign = useMemo(
    () => Object.entries(groupBy(surveyUnits, su => su.campaign)),
    [surveyUnits]
  );

  return (
    <Box m={2}>
      <Card elevation={2}>
        <CardContent>
          <Stack gap={4}>
            {/* Header */}
            <Typography variant="headingM" color="black" as="h1">
              Mon suivi
            </Typography>

            <Stack gap={2}>
              <Typography variant="s" color="textTertiary" as="p">
                Pour accéder au détail, cliquez directement sur l’enquête souhaitée.
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Grid container spacing={2}>
                    {surveyUnitsPerCampaign.map(([name, units]) => (
                      <Grid item xs={6}>
                        <CampaignProgress label={name} surveyUnits={units} />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
                <Grid item xs={6}>
                  <CampaignProgressPieChart />
                </Grid>
              </Grid>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
