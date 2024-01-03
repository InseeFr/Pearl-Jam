import UEPage from '../components/panel-body/UEpage';
import { SurveyUnitHeader } from '../ui/SurveyUnit/SurveyUnitHeader';
import { useParams } from 'react-router-dom';
import { useSurveyUnit } from '../utils/hooks/database';
import { SwipeableTab, SwipeableTabs } from '../SwipeableTabs';
import D from 'i18n';
import Box from '@mui/material/Box';
import { AddressCard } from '../ui/SurveyUnit/AddressCard';
import { IdentificationCard } from '../ui/SurveyUnit/IdentificationCard';
import { PersonsCard } from '../ui/SurveyUnit/PersonsCard';
import { ContactsCard } from '../ui/SurveyUnit/ContactsCard';

export function SurveyUnitPage() {
  const { id } = useParams();
  const surveyUnit = useSurveyUnit(id);

  // TODO : Remove this when finished
  const isNewDesign = window.location.search.includes('&redesign');

  if (!surveyUnit) {
    return null;
  }
  if (isNewDesign) {
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
            c
          </SwipeableTab>
          <SwipeableTab index={3} label={D.goToQuestionnairesPage}>
            d
          </SwipeableTab>
          <SwipeableTab index={4} label={D.goToCommentsPage}>
            e
          </SwipeableTab>
        </SwipeableTabs>
      </>
    );
  }

  return <UEPage />;
}
