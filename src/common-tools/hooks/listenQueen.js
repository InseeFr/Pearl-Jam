import { useEffect } from 'react';
import questionnaireEnum from 'common-tools/enum/QuestionnaireStateEnum';
import suStateEnum from 'common-tools/enum/SUStateEnum';
import surveyUnitDBService from 'indexedbb/services/surveyUnit-idb-service';

const computeSurveyUnitState = suToCompute => {
  const { questionnaireState } = suToCompute;
  let newSuState = '';
  switch (questionnaireState) {
    case questionnaireEnum.COMPLETED.type:
      newSuState = suStateEnum.WAITING_FOR_TRANSMISSION.type;
      break;
    case questionnaireEnum.STARTED.type:
      newSuState = suStateEnum.QUESTIONNAIRE_STARTED.type;
      break;
    default:
      break;
  }

  return { date: new Date().getTime(), type: newSuState };
};

const updateSurveyUnit = (surveyUnitID, queenState) => {
  surveyUnitDBService.getById(surveyUnitID).then(su => {
    const newSU = su;
    let newQuestionnaireState = '';
    switch (queenState) {
      case 'COMPLETED':
        newQuestionnaireState = questionnaireEnum.COMPLETED.type;
        break;
      case 'STARTED':
        newQuestionnaireState = questionnaireEnum.STARTED.type;
        break;
      default:
        break;
    }
    newSU.questionnaireState = newQuestionnaireState;
    const newState = computeSurveyUnitState(newSU);
    su.states.push(newState);
    const update = async () => {
      await surveyUnitDBService.update(newSU);
    };
    update();
  });
};

const closeQueen = history => surveyUnitID => {
  history.push(`/survey-unit/${surveyUnitID}/details`);
};

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
