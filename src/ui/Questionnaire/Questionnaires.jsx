import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Typography } from '../Typography';
import { Row } from '../Row';
import Stack from '@mui/material/Stack';
import React from 'react';
import Button from '@mui/material/Button';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';

export function Questionnaires({ surveyUnit }) {
  const { id } = surveyUnit;

  return (
    <Card p={2} elevation={0}>
      <CardContent>
        <Stack gap={3}>
          <Row gap={1}>
            <StickyNote2Icon fontSize="large" />
            <Typography as="h2" variant="xl" fontWeight={700}>
              Questionnaire
            </Typography>
          </Row>
          <Button
            variant="contained"
            startIcon={<LibraryBooksIcon />}
            component="a"
            href={`/queen/survey-unit/${id}`}
          >
            Accéder au questionnaire
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
