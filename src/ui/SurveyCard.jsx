import React from 'react';
import {
  convertSUStateInToDo,
  getLastState,
  getprivilegedPerson,
  daysLeftForSurveyUnit,
  isSelectable,
  getSuTodoState,
} from 'utils/functions';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import { Typography } from './Typography';
import Chip from '@mui/material/Chip';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LockIcon from '@mui/icons-material/Lock';
import { StatusChip } from './StatusChip';
import { Row } from './Row';
import { AbsoluteLink } from './AbsoluteLink';

/**
 * @param {SurveyUnit} surveyUnit
 * @param {boolean} locked
 * @returns {JSX.Element}
 */
export function SurveyCard({ surveyUnit, locked = false }) {
  const {
    id,
    address: { l6 },
    campaign,
    priority,
    persons,
  } = surveyUnit;
  const cityName = l6.replace(/^\d+\s/, '').trim();
  const privilegedPerson = getprivilegedPerson(surveyUnit);
  const { firstName, lastName } = privilegedPerson ?? persons[0];
  const state = getSuTodoState(surveyUnit);

  const isActive = isSelectable(surveyUnit);
  const variant = isActive ? undefined : 'disabled';

  return (
    <Card elevation={0} variant={variant}>
      <CardContent>
        <Stack gap={2}>
          <Row gap={0.5}>
            <Chip
              label={campaign.toLowerCase()}
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellispsis',
              }}
            />
            <Chip label={surveyUnit.sampleIdentifiers.ssech} />
            <Stack sx={{ marginLeft: 'auto' }} pl={2} alignItems="center">
              {!priority ? (
                <Typography color="textHint" variant="s" noWrap>
                  223-1111-75
                </Typography>
              ) : (
                <Typography variant="s" color="accent">
                  Prioritaire
                </Typography>
              )}
            </Stack>
          </Row>
          <Stack gap={0.5}>
            {/* Username */}
            <Row justifyContent="space-between">
              <Row gap={1}>
                <PersonOutlinedIcon color="textPrimary" />
                <AbsoluteLink to={isActive ? `/survey-unit/${id}/details?panel=0` : undefined}>
                  <Typography fontWeight={700} color="black" variant="xl">
                    {lastName.toUpperCase()} {firstName}
                  </Typography>
                </AbsoluteLink>
              </Row>
              {locked && <LockIcon color="iconLock" />}
            </Row>
            {/* data en dur pour le moment */}
            <Typography variant="s" color="textHint" as="div">
              #{surveyUnit.id}
            </Typography>
          </Stack>
          <Row gap={1}>
            <FmdGoodIcon color="textPrimary" />
            <Typography variant="s" color="textPrimary">
              {cityName}
            </Typography>
          </Row>
          <Row justifyContent="space-between">
            <Row gap={0.5}>
              <AccessTimeIcon color="textTertiary" />
              <Typography color="textTertiary" variant="s">{`${daysLeftForSurveyUnit(
                surveyUnit
              )} jours`}</Typography>
            </Row>
            <StatusChip status={state} />
          </Row>
        </Stack>
      </CardContent>
    </Card>
  );
}
