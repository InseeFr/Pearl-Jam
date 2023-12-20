import Card from '@mui/material/Card';
import { Typography } from '../Typography';
import Stack from '@mui/material/Stack';

/**
 * @param {string} label
 * @param {import("@src/pearl.type").SurveyUnit[]} surveyUnits
 * @return {JSX.Element}
 */
export function CampaignProgressPieChart() {
  return (
    <Card elevation={0} raised>
      <Stack gap={2} alignItems="center" p={2} sx={{ height: 646 }}>
        <Typography fontWeight={700} align="center" variant="headingS" component="h2" color="black">
          Nombre d’unités restantes à traiter
          <br /> par enquête et échéance
        </Typography>
      </Stack>
    </Card>
  );
}
