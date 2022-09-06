import React, { useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import D from 'i18n';
import IconButton from 'components/common/niceComponents/IconButton';
import SurveyUnitContext from '../UEContext';
import { isQuestionnaireAvailable } from 'utils/functions';

const Questionnaires = () => {
  const { surveyUnit, inaccessible } = useContext(SurveyUnitContext);
  const history = useHistory();
  const { id } = useParams();
  const openQueen = () => {
    history.push(`/queen/survey-unit/${id}`);
  };

  return (
    <IconButton
      iconType="questionnaire"
      label={D.questionnaireButton}
      disabled={!isQuestionnaireAvailable(surveyUnit)(inaccessible)}
      onClickFunction={openQueen}
      hasArrow
    />
  );
};

export default Questionnaires;
