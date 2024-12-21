import { Box, Card, CardContent, Grid, SelectChangeEvent, Stack, Typography } from '@mui/material';
import D from 'i18n';
import { ChangeEvent, useMemo, useState } from 'react';
import { SurveyUnit } from 'types/pearl';
import { ScrollableBox } from 'ui/ScrollableBox';
import { Select } from 'ui/Select';
import { CampaignProgress } from 'ui/Stats/CampaignProgress';
import { CampaignProgressPieChart } from 'ui/Stats/CampaignProgressPieChart';
import { daysLeftForSurveyUnit } from 'utils/functions';
import { groupBy } from 'utils/functions/array';

type SortDirection = 'asc' | 'desc' | 'deadlineDesc' | 'deadlineAsc';

interface StatsTrackingProps {
  surveyUnits: SurveyUnit[];
}

/**
 * @param {SurveyUnit[]} surveyUnits
 */
export function StatsTracking({ surveyUnits }: Readonly<StatsTrackingProps>) {
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const surveyUnitsPerCampaign = useMemo<Record<string, SurveyUnit[]>>(
    () => groupBy(surveyUnits, su => su.campaign),
    [surveyUnits]
  );

  const sortedCampaignLabels = useMemo(() => {
    if (sortDirection.startsWith('deadline')) {
      const labelsWithDeadline = Object.entries(surveyUnitsPerCampaign).map(([label, units]) => ({
        label,
        deadline: daysLeftForSurveyUnit(units),
      }));

      const sortedByDeadline = labelsWithDeadline.sort((a, b) => {
        if (sortDirection === 'deadlineAsc') {
          return a.deadline - b.deadline;
        } else {
          return b.deadline - a.deadline;
        }
      });

      return sortedByDeadline.map(item => item.label);
    } else {
      const labels = Object.keys(surveyUnitsPerCampaign);
      return labels.sort((a, b) => {
        if (sortDirection === 'desc') {
          return b.localeCompare(a);
        } else {
          // 'asc'
          return a.localeCompare(b);
        }
      });
    }
  }, [surveyUnitsPerCampaign, sortDirection]);

  type SortOption = {
    value: SortDirection;
    label: string;
  };

  const sortOptions: SortOption[] = [
    { value: 'asc', label: `${D.campaignNameAsc}` },
    { value: 'desc', label: `${D.campaignNameDesc}` },
    { value: 'deadlineAsc', label: `${D.shortDeadline}` },
    { value: 'deadlineDesc', label: `${D.longDeadline}` },
  ];

  return (
    <Box m={2}>
      <Card elevation={2}>
        <CardContent>
          <Stack gap={4}>
            <Box display="flex" alignItems="center" flexWrap="wrap">
              <Typography variant="body1" sx={{ flexGrow: 0, marginRight: 2 }}>
                {D.trackingAccessDetailedData}
              </Typography>
              <Select
                options={sortOptions}
                value={sortDirection}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSortDirection(e.target.value as SortDirection)
                }
                placeholder={D.noSorting}
                allowEmpty
                sx={{ width: '210px' }}
              />
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <ScrollableBox height="646px">
                  <Grid container spacing={2}>
                    {sortedCampaignLabels.map(label => (
                      <Grid item xs={12} sm={6} key={label}>
                        <CampaignProgress
                          label={label}
                          surveyUnits={surveyUnitsPerCampaign[label]}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </ScrollableBox>
              </Grid>
              <Grid item xs={6}>
                <CampaignProgressPieChart surveyUnits={surveyUnits} />
              </Grid>
            </Grid>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
