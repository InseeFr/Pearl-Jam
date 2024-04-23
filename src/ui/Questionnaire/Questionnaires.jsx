import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Typography } from '../Typography';
import { Row } from '../Row';
import Stack from '@mui/material/Stack';
import React from 'react';
import Button from '@mui/material/Button';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import D from 'i18n';
import { isQuestionnaireAvailable } from '../../utils/functions';

export function Questionnaires({ surveyUnit }) {
  const { id } = surveyUnit;
  const isAvailable = isQuestionnaireAvailable(surveyUnit)(false);

  return (
    <Card p={2} elevation={0}>
      <CardContent>
        <Stack gap={3}>
          <Row gap={1}>
            <StickyNote2Icon fontSize="large" />
            <Typography as="h2" variant="xl" fontWeight={700}>
              {D.openQuestionnaire}
            </Typography>
          </Row>
          <Button
            variant="contained"
            disabled={!isAvailable}
            startIcon={<LibraryBooksIcon />}
            component="a"
            href={`/queen/survey-unit/${id}`}
          >
            {D.accessTheQuestionnaire}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
