import { addNewState } from 'utils/functions/surveyUnitFunctions';
import questionnaireEnum from 'utils/enum/QuestionnaireStateEnum';
import surveyUnitDBService from 'utils/indexeddb/services/surveyUnit-idb-service';
import { surveyUnitStateEnum } from 'utils/enum/SUStateEnum';
import { useEffect } from 'react';

const computeSurveyUnitState = questionnaireState => {
  switch (questionnaireState) {
    case questionnaireEnum.COMPLETED.type:
      return surveyUnitStateEnum.WAITING_FOR_TRANSMISSION.type;
    case questionnaireEnum.STARTED.type:
      return surveyUnitStateEnum.QUESTIONNAIRE_STARTED.type;
    case questionnaireEnum.VALIDATED.type:
      return surveyUnitStateEnum.WAITING_FOR_TRANSMISSION.type;
    default:
      return 'ERR';
  }
};

const updateSurveyUnit = (surveyUnitID, queenState) => {
  surveyUnitDBService.getById(surveyUnitID).then(su => {
    let newQuestionnaireState = '';
    switch (queenState) {
      case 'COMPLETED':
        newQuestionnaireState = questionnaireEnum.COMPLETED.type;
        break;
      case 'STARTED':
        newQuestionnaireState = questionnaireEnum.STARTED.type;
        break;
      case 'VALIDATED':
        newQuestionnaireState = questionnaireEnum.VALIDATED.type;
        break;
      default:
        break;
    }

    const newStateType = computeSurveyUnitState(newQuestionnaireState);
    const update = async () => {
      await addNewState(su, newStateType);
    };
    update();
  });
};

const closeQueen = history => surveyUnitID => {
  history.push(`/survey-unit/${surveyUnitID}/details`);
};

// eslint-disable-next-line consistent-return
const handleQueenEvent = history => async event => {
  const { type, command, ...other } = event.detail;
  if (type === 'QUEEN') {
    switch (command) {
      case 'CLOSE_QUEEN':
        closeQueen(history)(other.surveyUnit);
        break;
      case 'UPDATE_SURVEY_UNIT':
        await updateSurveyUnit(other.surveyUnit, other.state);
        window.dispatchEvent(new CustomEvent('pearl-update'));
        break;
      case 'UPDATE_SYNCHRONIZE':
        // NOT here
        break;
      case 'HEALTH_CHECK':
        return true;
      default:
        break;
    }
  }
};

function useQueenListener(history) {
  useEffect(() => {
    window.addEventListener('QUEEN', handleQueenEvent(history));
    return () => {
      window.removeEventListener('QUEEN', handleQueenEvent(history));
    };
  });
}

export default useQueenListener;
