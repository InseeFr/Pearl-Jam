import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Box from '@mui/material/Box';
import { Typography } from '../Typography';
import Stack from '@mui/material/Stack';
import { Row } from '../Row';
import { useTheme } from '@mui/material/styles';
import { CenteredBox } from '../CenteredBox';
import { daysLeftForSurveyUnit, getSuTodoState } from '../../utils/functions';
import { groupBy } from '../../utils/functions/array';
import { toDoEnum } from '../../utils/enum/SUToDoEnum';
import { useToggle } from '../../utils/hooks/useToggle';
import { StatusChip } from '../StatusChip';
import D from 'i18n';
import { SurveyUnit } from 'types/pearl';

interface CampaignProgressProps {
  label: string;
  surveyUnits: SurveyUnit[];
}

/**
 * @param {string} label
 * @param {SurveyUnit[]} surveyUnits
 * @return {JSX.Element}
 */
export function CampaignProgress({ label, surveyUnits }: Readonly<CampaignProgressProps>) {
  const total = surveyUnits.length;
  const theme = useTheme();
  const suByTodoState = groupBy(surveyUnits, su => getSuTodoState(su).order);
  const finished = suByTodoState[toDoEnum.TERMINATED.order]?.length ?? 0;
  const [isFlipped, toggleFlip] = useToggle(false);

  return (
    <Card elevation={0} raised>
      <CardActionArea onClick={toggleFlip}>
        <Stack gap={2} alignItems="center" p={2} sx={{ height: 325 }}>
          <Typography fontWeight={700} noWrap variant="headingS" component="h2" color="black">
            {label}
          </Typography>
          {isFlipped ? (
            <Stack gap={0.5} sx={{ width: '100%' }}>
              {Object.values(toDoEnum).map(state => (
                <Row key={state.order} justifyContent="space-between">
                  <StatusChip status={state} />
                  <Typography variant="s">{suByTodoState[state.order]?.length ?? 0}</Typography>
                </Row>
              ))}
              <Row
                justifyContent="space-between"
                pt={0.5}
                pl={1.5}
                sx={{ borderTop: `solid 1px ${theme.palette.black.main}` }}
              >
                <Typography variant="s">Total</Typography>
                <Typography variant="s">{total}</Typography>
              </Row>
            </Stack>
          ) : (
            <>
              <Box p={3}>
                <CenteredBox
                  position="relative"
                  width={150}
                  height={150}
                  sx={{ borderRadius: 150 }}
                >
                  <CircularProgress
                    color="surfaceTertiary"
                    size={146}
                    variant="determinate"
                    value={100}
                    thickness={2}
                    sx={{ backgroundColor: theme.palette.primary, borderRadius: 150 }}
                  />
                  <CircularProgress
                    color="green"
                    size={150}
                    variant="determinate"
                    value={(100 * finished) / total}
                    thickness={3}
                  />
                  <Typography
                    variant="headingL"
                    component="div"
                    color="textPrimary"
                    fontWeight={400}
                  >
                    {finished}/{total}
                  </Typography>
                </CenteredBox>
              </Box>
              <Typography variant="s" color="textHint" fontWeight={700}>
                {`${D.dueDate}: ${daysLeftForSurveyUnit(surveyUnits)} ${D.days}`}
              </Typography>
            </>
          )}
        </Stack>
      </CardActionArea>
    </Card>
  );
}
