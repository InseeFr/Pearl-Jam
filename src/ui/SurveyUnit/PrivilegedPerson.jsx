import Stack from '@mui/material/Stack';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { Row } from '../Row';
import { getprivilegedPerson } from '../../utils/functions';
import { Typography } from '../Typography';

/**
 * Display the privileged personn attached to a survey unit
 *
 * @param {SurveyUnit} surveyUnit
 */
export function PrivilegedPerson({ surveyUnit }) {
  const person = getprivilegedPerson(surveyUnit);
  return (
    <Stack gap={0.5}>
      <Row gap={1}>
        <PersonOutlineIcon color="textPrimary" />
        <Typography color="textPrimary" variant="xl" fontWeight={700}>
          {person.lastName.toUpperCase()} {person.firstName}
        </Typography>
      </Row>
      <Typography color="textHint" variant="s">
        #{surveyUnit.id}
      </Typography>
    </Stack>
  );
}
