import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import { Link as RouterLink } from 'react-router-dom';
import { Row } from '../Row';
import { Typography } from '../Typography';

import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import D from 'i18n';
import { SurveyUnit } from 'types/pearl';
import { isQuestionnaireAvailable } from '../../utils/functions';

export function Questionnaires({ surveyUnit }: Readonly<{ surveyUnit: SurveyUnit }>) {
  const { id } = surveyUnit;
  const isAvailable = isQuestionnaireAvailable(surveyUnit)(false);

  return (
    <Card elevation={0}>
      <CardContent>
        <Stack gap={3}>
          <Row gap={1}>
            <StickyNote2Icon fontSize="large" />
            <Typography component="h2" variant="xl" fontWeight={700}>
              {D.openQuestionnaire}
            </Typography>
          </Row>
          <Button
            variant="contained"
            disabled={!isAvailable}
            startIcon={<LibraryBooksIcon />}
            component={RouterLink}
            to={`/queen/interrogations/${id}`}
          >
            {D.accessTheQuestionnaire}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
