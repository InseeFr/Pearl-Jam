import Card from '@mui/material/Card';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CardContent from '@mui/material/CardContent';
import { Typography } from '../Typography';
import D from 'i18n';
import { Row } from '../Row';
import Stack from '@mui/material/Stack';
import React, { Fragment } from 'react';
import PermContactCalendarOutlinedIcon from '@mui/icons-material/PermContactCalendarOutlined';
import Box from '@mui/material/Box';
import { findContactOutcomeValueByType } from '../../utils/enum/ContactOutcomeEnum';
import { formatDate } from '../../utils/functions/date';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { findContactAttemptValueByType } from '../../utils/enum/ContactAttemptEnum';
import { surveyUnitIDBService } from '../../utils/indexeddb/services/surveyUnit-idb-service';

/**
 * Display persons linked to a survey unit
 *
 * @param {SurveyUnit} surveyUnit
 */
export function ContactsCard({ surveyUnit }) {
  const contactAttempts = surveyUnit.contactAttempts ?? [];
  const showDivider = surveyUnit.contactOutcome?.type && contactAttempts.length > 0;

  /** @type {(a: SurveyUnitContactAttempt) => void}} */
  const handleDeleteAttempt = attempt => {
    surveyUnitIDBService.update({
      ...surveyUnit,
      contactAttempts: contactAttempts.filter(a => a !== attempt),
    });
  };
  return (
    <>
      <Card p={2} elevation={0}>
        <CardContent>
          <Stack gap={3}>
            <Row gap={1}>
              <PermContactCalendarOutlinedIcon fontSize="large" />
              <Typography as="h2" variant="xl" fontWeight={700}>
                {D.contactAttempts}
              </Typography>
            </Row>

            <Stack gap={3} alignItems="stretch">
              <ContactOutcome contact={surveyUnit.contactOutcome} />
              {showDivider && <Divider />}
              <Stack gap={2} width={1} alignItems="stretch">
                {contactAttempts.map(attempt => (
                  <ContactAttempt
                    attempt={attempt}
                    key={attempt.date}
                    onDelete={handleDeleteAttempt}
                  />
                ))}
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}

/**
 * Display the contact outcome
 * @param {SurveyUnit["contactOutcome"]|undefined} contact
 */
function ContactOutcome({ contact }) {
  if (!contact?.type) {
    return null;
  }
  return (
    <Box px={2} py={1.5} borderRadius={1} bgcolor="surfacePrimary.main">
      <Row justifyContent="space-between">
        <div>
          <Typography color="textPrimary" variant="s" as="div">
            {findContactOutcomeValueByType(contact.type)}
          </Typography>
          <Typography color="textTertiary" variant="s" as="div">
            {formatDate(contact.date)}
          </Typography>
        </div>
        <CheckCircleIcon color="success" />
      </Row>
    </Box>
  );
}

/**
 * Display a contact attempt
 * @param {SurveyUnitContactAttempt} attempt
 * @param {(a: SurveyUnitContactAttempt) => void} onDelete
 */
function ContactAttempt({ attempt, onDelete }) {
  return (
    <Box px={2} py={1.5} borderRadius={1} bgcolor="surfacePrimary.main">
      <Row justifyContent="space-between">
        <div>
          <Typography color="textPrimary" variant="s" as="div">
            {findContactAttemptValueByType(attempt.status)}
          </Typography>
          <Typography color="textTertiary" variant="s" as="div">
            {formatDate(attempt.date, true)}
          </Typography>
        </div>
        <IconButton edge="end" onClick={() => onDelete(attempt)}>
          <DeleteOutlineIcon color="textPrimary" />
        </IconButton>
      </Row>
    </Box>
  );
}