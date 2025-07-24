import NotInterestedIcon from '@mui/icons-material/NotInterested';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import D from 'i18n';
import { useEffect } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { CommunicationsCard } from 'ui/SurveyUnit/Communication/CommunicationsCard';
import { ContactsCard } from 'ui/SurveyUnit/Contact/ContactsCard';
import { SwipeableTab, SwipeableTabs } from '../SwipeableTabs';
import { Questionnaires } from '../ui/Questionnaire/Questionnaires';
import { AddressCard } from '../ui/SurveyUnit/AddressCard';
import { CommentCard } from '../ui/SurveyUnit/CommentCard';
import { IdentificationCard } from '../ui/SurveyUnit/Identification/IdentificationCard';
import { PersonsCard } from '../ui/SurveyUnit/PersonsCard';
import { SurveyUnitHeader } from '../ui/SurveyUnit/SurveyUnitHeader';
import { Typography } from '../ui/Typography';
import { surveyUnitStateEnum } from '../utils/enum/SUStateEnum';
import { addNewState, getLastState, persistSurveyUnit } from '../utils/functions';
import { useSurveyUnit } from '../utils/hooks/database';
import { PreviousCollectCard } from 'ui/SurveyUnit/SurveyHistory/PreviousCollectCard';
import { NextCollectHistory, PreviousCollectHistory } from 'types/pearl';
import { NextCollectCard } from 'ui/SurveyUnit/SurveyHistory/NextCollectCard';

export function SurveyUnitPage() {
  const { id } = useParams<{ id: string }>();
  const surveyUnit = useSurveyUnit(id!);

  useEffect(() => {
    if (surveyUnit !== undefined) {
      const lastState = getLastState(surveyUnit.states);
      if (lastState?.type === surveyUnitStateEnum.VISIBLE_AND_CLICKABLE.type) {
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

  const mockPreviousCollectHistory: PreviousCollectHistory = {
    outcome: 'Completed',
    houseHoldComposition: [{ firstName: 'John', isPanel: true, civilite: 'male', age: 23 }],
    interviewerComment: 'No issues during the previous collection.',
  };

  const mockNextCollect: NextCollectHistory = {
    houseHoldComposition: [
      { firstName: 'John', isPanel: true, civilite: 'male', age: 23, isMailContact: true },
    ],
  };

  console.log(mockNextCollect);

  return (
    <>
      <SurveyUnitHeader surveyUnit={surveyUnit} />
      <SwipeableTabs>
        {mockPreviousCollectHistory && (
          <SwipeableTab index={0} label={D.goToPreviousCollect}>
            <PreviousCollectCard previousCollectHistory={mockPreviousCollectHistory} />
          </SwipeableTab>
        )}
        <SwipeableTab index={1} label={D.goToIdentificationPage}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <AddressCard surveyUnit={surveyUnit} />
            <IdentificationCard surveyUnit={surveyUnit} />
          </Box>
        </SwipeableTab>
        <SwipeableTab index={2} label={D.goToContactPage}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '2rem' }}>
            <PersonsCard surveyUnit={surveyUnit} />
            <ContactsCard surveyUnit={surveyUnit} />
          </Box>
        </SwipeableTab>
        <SwipeableTab index={3} label={D.goToCommunicationPage}>
          <CommunicationsCard surveyUnit={surveyUnit} />
        </SwipeableTab>
        <SwipeableTab index={4} label={D.goToQuestionnairesPage}>
          <Questionnaires surveyUnit={surveyUnit} />
        </SwipeableTab>
        <SwipeableTab index={5} label={D.goToCommentsPage}>
          <CommentCard surveyUnit={surveyUnit} />
        </SwipeableTab>
        {mockNextCollect && (
          <SwipeableTab index={6} label={D.goToNextCollect}>
            <NextCollectCard nextCollectHistory={mockNextCollect} />
          </SwipeableTab>
        )}
      </SwipeableTabs>
    </>
  );
}
