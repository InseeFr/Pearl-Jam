import { Box, Card, CardContent, Stack, Typography, Grid, SelectChangeEvent } from '@mui/material';
import { useState, useMemo, SetStateAction } from 'react';
import { ScrollableBox } from 'ui/ScrollableBox';
import { CampaignProgress } from 'ui/Stats/CampaignProgress';
import { CampaignProgressPieChart } from 'ui/Stats/CampaignProgressPieChart';
import { daysLeftForSurveyUnit } from 'utils/functions';
import { groupBy } from 'utils/functions/array';
import D from 'i18n';
import { SurveyUnit } from 'types/pearl';
import { Select } from 'ui/Select';

type SortDirection = 'asc' | 'desc' | 'deadlineDesc' | 'deadlineAsc';

interface StatsTrackingProps {
  surveyUnits: SurveyUnit[];
}

/**
 * @param {SurveyUnit[]} surveyUnits
 */
export function StatsTracking({ surveyUnits }: Readonly<StatsTrackingProps>) {
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const handleSortChange = (direction: SetStateAction<SortDirection>) => {
    setSortDirection(direction);
  };

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

  const sortOptions = [
    { value: 'asc' as SortDirection, label: `${D.campaignNameAsc}` },
    { value: 'desc' as SortDirection, label: `${D.campaignNameDesc}` },
    { value: 'deadlineAsc' as SortDirection, label: `${D.shortDeadline}` },
    { value: 'deadlineDesc' as SortDirection, label: `${D.longDeadline}` },
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
                onChange={(e: SelectChangeEvent<SetStateAction<SortDirection>>) =>
                  handleSortChange(e.target.value as SortDirection)
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
