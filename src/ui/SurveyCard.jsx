import React from 'react';
import {
  convertSUStateInToDo,
  getLastState,
  getprivilegedPerson,
  intervalInDays,
  isSelectable
} from 'utils/functions';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { Typography } from './Typography';
import Chip from '@mui/material/Chip';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LockIcon from '@mui/icons-material/Lock';
import { StatusChip } from './StatusChip';
import { Row } from './Row';

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

  const active = isSelectable(surveyUnit);
  const inactiveStyle = {
    backgroundColor: '#E6EAF0',
    color: "red",
    '&:hover': {
      cursor: 'not-allowed',
    },
  };


  return (
    <Card sx={{ p: 3, ...(active ? inactiveStyle : {}) }} elevation={0}>
      <Stack gap={2}>
        <Row gap={0.5}>
          <Chip
            label={campaign.toLowerCase()}
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellispsis',
              fontSize: '14px',
              fontWeight: 600,
            }}
          />
          <Chip label="2" sx={{ fontSize: '14px', fontWeight: 600 }} />
          <Stack sx={{ marginLeft: 'auto' }} pl={2} alignItems="center">
            <Typography color="surfaceSecondary" variant="s" noWrap>
              223-1111-75
            </Typography>
          </Stack>
        </Row>
        <Stack gap={0.5}>
          {/* Username */}
          <Row justifyContent="space-between">
            <Row gap={1}>
              <PersonOutlinedIcon color="typographyprimary" />
              <Typography sx={{ fontWeight: '700' }} color="black" variant="xl">
                {lastName} {firstName}
              </Typography>
            </Row>
            {inaccessible && (
            <LockIcon color="iconLock" />
            )}
          </Row>
          {/* data en dur pour le moment */}
          <Typography variant="s" color="hint" as="div">
            #02000000000
          </Typography>
        </Stack>
        <Row gap={1}>
          <FmdGoodIcon color="typographyprimary" />
          <Typography variant="s" color="primary">
            {cityName}
          </Typography>
        </Row>
        <Row justifyContent="space-between">
          <Row gap={0.5}>
            <AccessTimeIcon color="typographytertiary" />
            <Typography color="tertiary" variant="s">{`${nbJoursRestant} jours`}</Typography>
          </Row>
          <StatusChip color="#0A192E" status={todo} />
        </Row>
      </Stack>
    </Card>
  );
}
