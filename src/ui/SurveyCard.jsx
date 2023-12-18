import React from 'react';
import {
  convertSUStateInToDo,
  getLastState,
  getprivilegedPerson,
  intervalInDays,
} from 'utils/functions';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LockIcon from '@mui/icons-material/Lock';
import { StatusChip } from './StatusChip';

export function SurveyCard({ surveyUnit, inaccessible = false }) {
  const {
    id,
    address: { l6 },
    campaign,
    sampleIdentifiers: { ssech },
    priority,
    persons,
  } = surveyUnit;
  const cityName = l6.replace(/^\d+\s/, '').trim();
  const privilegedPerson = getprivilegedPerson(surveyUnit);
  const { firstName, lastName } = privilegedPerson ?? persons[0];
  const nbJoursRestant = intervalInDays(surveyUnit);
  const lastState = getLastState(surveyUnit);
  const todo = convertSUStateInToDo(lastState.type);
  const { order, value: toDoLabel } = todo;
  // const openSurveyUnitPage = id => navigate(`/survey-unit/${id}/details?panel=0`);
  return (
    <Card sx={{ p: 3 }} elevation={0}>
      <Stack gap={2}>
        <Stack direction="row" gap={0.5} alignItems="center">
          <Chip
            label={campaign.toLowerCase()}
            sx={{ overflow: 'hidden', textOverflow: 'ellispsis' }}
          />
          <Chip label="2" />
          <Stack sx={{ marginLeft: 'auto' }} pl={2} alignItems="center">
            <Typography noWrap>223-1111-75</Typography>
          </Stack>
        </Stack>
        <Stack gap={0.5}>
          {/* Username */}
          <Stack direction="row" justifyContent="space-between">
            <Stack direction="row" gap={1}>
              <PersonOutlinedIcon />
              <Typography>
                {lastName} {firstName}
              </Typography>
            </Stack>
            <LockIcon />
          </Stack>
          {/* data en dur pour le moment */}
          <Typography as="div">#02000000000</Typography>
        </Stack>
        <Stack direction="row" gap={1}>
          <FmdGoodIcon />
          <Typography>{cityName}</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" gap={0.5} alignItems="center">
            <AccessTimeIcon />
            <Typography>{`${nbJoursRestant} jours`}</Typography>
          </Stack>
          <Stack>
            <StatusChip status={todo} />
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}
