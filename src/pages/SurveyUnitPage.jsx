import { SurveyUnitHeader } from '../ui/SurveyUnit/SurveyUnitHeader';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { useSurveyUnit } from '../utils/hooks/database';
import { SwipeableTab, SwipeableTabs } from '../SwipeableTabs';
import D from 'i18n';
import Box from '@mui/material/Box';
import { AddressCard } from '../ui/SurveyUnit/AddressCard';
import { IdentificationCard } from '../ui/SurveyUnit/IdentificationCard';
import { PersonsCard } from '../ui/SurveyUnit/PersonsCard';
import { ContactsCard } from '../ui/SurveyUnit/ContactsCard';
import { CommunicationsCard } from '../ui/SurveyUnit/CommunicationsCard';
import { CommentCard } from '../ui/SurveyUnit/CommentCard';
import { QuestionnaireCard } from '../ui/Questionnaire/QuestionnaireCard';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import Button from '@mui/material/Button';
import { Typography } from '../ui/Typography';

export function SurveyUnitPage() {
  const { id } = useParams();
  const surveyUnit = useSurveyUnit(id);

  if (surveyUnit === undefined) {
    return (
      <Stack gap={1} alignItems="center" p={20}>
        <CircularProgress color="primary" />
        <Box component="h3">{D.pleaseWait}</Box>
      </Stack>
    );
  }

  if (!surveyUnit) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        gap={3}
        sx={{ height: 'calc(100vh - 150px)' }}
      >
        <Stack gap={1} alignItems="center">
          <NotInterestedIcon color="textHint" sx={{ fontSize: '5rem' }} />
          <Typography variant="s" color="textHint">
            {D.notFoundSurveyUnit}
          </Typography>
        </Stack>
        <Button component={RouterLink} to="/" variant="contained">
          {D.backListSurveyUnit}
        </Button>
      </Stack>
    );
  }

  return (
    <>
      <SurveyUnitHeader surveyUnit={surveyUnit} />
      <SwipeableTabs value={1}>
        <SwipeableTab index={0} label={D.goToIdentificationPage}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <AddressCard surveyUnit={surveyUnit} />
            <IdentificationCard surveyUnit={surveyUnit} />
          </Box>
        </SwipeableTab>
        <SwipeableTab index={1} label={D.goToContactPage}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <PersonsCard surveyUnit={surveyUnit} />
            <ContactsCard surveyUnit={surveyUnit} />
          </Box>
        </SwipeableTab>
        <SwipeableTab index={2} label={D.goToCommunicationPage}>
          <CommunicationsCard surveyUnit={surveyUnit} />
        </SwipeableTab>
        <SwipeableTab index={3} label={D.goToQuestionnairesPage}>
          <QuestionnaireCard surveyUnit={surveyUnit} />
        </SwipeableTab>
        <SwipeableTab index={4} label={D.goToCommentsPage}>
          <CommentCard surveyUnit={surveyUnit} />
        </SwipeableTab>
      </SwipeableTabs>
    </>
  );
}
