import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import D from 'i18n';
import IconButton from 'components/common/sharedComponents/IconButton';
import SurveyUnitContext from '../UEContext';
import { isQuestionnaireAvailable } from 'utils/functions';

const Questionnaires = () => {
  const { surveyUnit, inaccessible } = useContext(SurveyUnitContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const openQueen = () => {
    navigate(`/queen/survey-unit/${id}`);
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
