import questionnaireEnum from 'common-tools/enum/QuestionnaireStateEnum';
import suStateEnum from 'common-tools/enum/SUStateEnum';
import { addNewState } from 'common-tools/functions/surveyUnitFunctions';
import surveyUnitDBService from 'indexedbb/services/surveyUnit-idb-service';
import { useEffect } from 'react';

const computeSurveyUnitState = questionnaireState => {
  switch (questionnaireState) {
    case questionnaireEnum.COMPLETED.type:
      return suStateEnum.WAITING_FOR_TRANSMISSION.type;
    case questionnaireEnum.STARTED.type:
      return suStateEnum.QUESTIONNAIRE_STARTED.type;
    case questionnaireEnum.VALIDATED.type:
      return suStateEnum.WAITING_FOR_TRANSMISSION.type;
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
