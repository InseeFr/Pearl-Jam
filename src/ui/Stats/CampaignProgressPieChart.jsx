import Card from '@mui/material/Card';
import { Typography } from '../Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { PieChart } from './PieChart';
import { daysLeftForSurveyUnit, getSuTodoState } from '../../utils/functions';
import { generateColorInGradient } from '../../utils/functions/colors';
import { Row } from '../Row';
import { groupBy } from '../../utils/functions/array';
import { toDoEnum } from '../../utils/enum/SUToDoEnum';

const colorStart = '#D3DBE5';
const colorEnd = '#3A4657';
const getColorForRate = rate => generateColorInGradient(colorStart, colorEnd, rate);

const legendBar = {
  width: 330,
  height: 5,
  borderRadius: 5,
  background: `linear-gradient(to right, ${colorStart}, ${colorEnd})`,
};

/**
 * Card with a pie chart that show surveyUnits in progress
 *
 * @param {SurveyUnit[]} surveyUnits
 * @return {JSX.Element}
 */
export function CampaignProgressPieChart({ surveyUnits }) {
  // Only keep survey units that are not finished
  surveyUnits = surveyUnits.filter(su => getSuTodoState(su).order !== toDoEnum.TERMINATED.order);
  const total = surveyUnits.length;
  // We have no survey units in progress, we won't be able to show a graph
  if (total === 0) {
    return '';
  }

  const maxDays = Math.max(...surveyUnits.map(daysLeftForSurveyUnit));
  const surveyUnitsInProgressPerCampaign = groupBy(surveyUnits, su => su.campaign);
  const slices = Object.entries(surveyUnitsInProgressPerCampaign).map(([label, surveyUnits]) => ({
    label,
    value: surveyUnits.length / total,
    rate: maxDays === 0 ? 0 : daysLeftForSurveyUnit(surveyUnits) / maxDays,
    color: getColorForRate(maxDays === 0 ? 0 : daysLeftForSurveyUnit(surveyUnits) / maxDays),
  }));
  return (
    <Card elevation={0} raised>
      <Stack gap={2} alignItems="center" p={2} sx={{ height: 646 }}>
        <Typography fontWeight={700} align="center" variant="headingS" component="h2" color="black">
          Nombre d’unités restantes à traiter
          <br /> par enquête et échéance
        </Typography>
        <div>
          <PieChart size={240} parts={slices} paddingBlock={80} paddingInline={100} />
        </div>
        <Stack gap={0} sx={{ width: 330 }}>
          <Typography variant="xl" color="black" as="p" textAlign="center">
            Échéance
          </Typography>
          <Row justifyContent="space-between" pb={0.5}>
            <Typography variant="s" color="black" as="div">
              0 jours.
            </Typography>
            <Typography variant="s" color="black" textAlign="right" as="div">
              {maxDays} jours.
            </Typography>
          </Row>
          <Box sx={legendBar}></Box>
        </Stack>
      </Stack>
    </Card>
  );
}
