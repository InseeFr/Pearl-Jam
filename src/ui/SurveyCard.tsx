import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import LockIcon from '@mui/icons-material/Lock';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { SurveyUnit } from 'types/pearl';
import {
  daysLeftForSurveyUnit,
  getprivilegedPerson,
  getSuTodoState,
  isSelectable,
} from 'utils/functions';
import D from '../i18n/build-dictionary';
import { AbsoluteLink } from './AbsoluteLink';
import { Row } from './Row';
import { StatusChip } from './StatusChip';
import { Typography } from './Typography';

interface SurveyCardProps {
  surveyUnit: SurveyUnit;
  locked: boolean;
}

export function SurveyCard({ surveyUnit, locked = false }: Readonly<SurveyCardProps>) {
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
                  {surveyUnit.sampleIdentifiers.nograp}
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
                <AbsoluteLink to={isActive ? `/survey-unit/${id}/details` : undefined}>
                  <Typography fontWeight={700} color="black" variant="xl">
                    {lastName.toUpperCase()} {firstName}
                  </Typography>
                </AbsoluteLink>
              </Row>
              {locked && <LockIcon color="iconLock" />}
            </Row>
            <Typography variant="s" color="textHint" component="div">
              #{surveyUnit.displayName ?? surveyUnit.id}
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
              )} ${D.days}`}</Typography>
            </Row>
            <StatusChip status={state} />
          </Row>
        </Stack>
      </CardContent>
    </Card>
  );
}
