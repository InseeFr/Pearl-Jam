import { SurveyUnitHeader } from '../ui/SurveyUnit/SurveyUnitHeader';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { useSurveyUnit } from '../utils/hooks/database';
import { SwipeableTab, SwipeableTabs } from '../SwipeableTabs';
import D from 'i18n';
import { CommunicationsCard } from 'ui/SurveyUnit/Communication/CommunicationsCard';
import Box from '@mui/material/Box';
import { AddressCard } from '../ui/SurveyUnit/AddressCard';
import { IdentificationCard } from '../ui/SurveyUnit/Identification/IdentificationCard';
import { PersonsCard } from '../ui/SurveyUnit/PersonsCard';
import { CommentCard } from '../ui/SurveyUnit/CommentCard';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import Button from '@mui/material/Button';
import { Typography } from '../ui/Typography';
import { Questionnaires } from '../ui/Questionnaire/Questionnaires';
import { addNewState, getSuTodoState, persistSurveyUnit } from '../utils/functions';
import { useEffect } from 'react';
import { surveyUnitStateEnum } from '../utils/enum/SUStateEnum';
import { ContactsCard } from 'ui/SurveyUnit/Contact/ContactsCard';

export function SurveyUnitPage() {
  const { id } = useParams<{ id: string }>();
  const surveyUnit = useSurveyUnit(id!);

  useEffect(() => {
    if (surveyUnit !== undefined) {
      const lastState = getSuTodoState(surveyUnit);
      if (lastState?.value === surveyUnitStateEnum.VISIBLE_AND_CLICKABLE.type) {
        const newStates = addNewState(surveyUnit, surveyUnitStateEnum.IN_PREPARATION.type);
        persistSurveyUnit({ ...surveyUnit, states: newStates });
      }
    }
  }, [surveyUnit]);

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
      <SwipeableTabs>
        <SwipeableTab index={0} label={D.goToIdentificationPage}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <AddressCard surveyUnit={surveyUnit} />
            <IdentificationCard surveyUnit={surveyUnit} />
          </Box>
        </SwipeableTab>
        <SwipeableTab index={1} label={D.goToContactPage}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '2rem' }}>
            <PersonsCard surveyUnit={surveyUnit} />
            <ContactsCard surveyUnit={surveyUnit} />
          </Box>
        </SwipeableTab>
        <SwipeableTab index={2} label={D.goToCommunicationPage}>
          <CommunicationsCard surveyUnit={surveyUnit} />
        </SwipeableTab>
        <SwipeableTab index={3} label={D.goToQuestionnairesPage}>
          {/* <QuestionnaireCard surveyUnit={surveyUnit} /> */}
          <Questionnaires surveyUnit={surveyUnit} />
        </SwipeableTab>
        <SwipeableTab index={4} label={D.goToCommentsPage}>
          <CommentCard surveyUnit={surveyUnit} />
        </SwipeableTab>
      </SwipeableTabs>
    </>
  );
}
