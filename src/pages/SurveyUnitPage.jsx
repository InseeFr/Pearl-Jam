import UEPage from '../components/panel-body/UEpage';
import { SurveyUnitHeader } from '../ui/SurveyUnit/SurveyUnitHeader';
import { useParams } from 'react-router-dom';
import { useSurveyUnit } from '../utils/hooks/database';

export function SurveyUnitPage() {
  const { id } = useParams();
  const surveyUnit = useSurveyUnit(id);

  // TODO : Remove this when finished
  const isNewDesign = window.location.search.includes('&redesign');

  if (!surveyUnit) {
    return null;
  }

  if (isNewDesign) {
    return <SurveyUnitHeader surveyUnit={surveyUnit} />;
  }

  return <UEPage />;
}
