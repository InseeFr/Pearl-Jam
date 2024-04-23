import { addNewState } from 'utils/functions/surveyUnitFunctions';
import questionnaireEnum from 'utils/enum/QuestionnaireStateEnum';
import surveyUnitDBService from 'utils/indexeddb/services/surveyUnit-idb-service';
import { surveyUnitStateEnum } from 'utils/enum/SUStateEnum';
import { useEffect } from 'react';
import { persistSurveyUnit } from '../functions';

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
    const newStates = addNewState(su, newStateType);
    persistSurveyUnit({ ...su, states: newStates });
  });
};

/**
 @param {(s: string) => void} redirect
 * @return {(s: string) => void}
 */
const closeQueen = redirect => surveyUnitID => {
  redirect(`/survey-unit/${surveyUnitID}/details`);
};

// eslint-disable-next-line consistent-return
const handleQueenEvent = redirect => async event => {
  const { type, command, ...other } = event.detail;
  if (type === 'QUEEN') {
    switch (command) {
      case 'CLOSE_QUEEN':
        closeQueen(redirect)(other.surveyUnit);
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

/**
 * @param {(s: string) => void} redirect
 */
export function useQueenListener(redirect) {
  useEffect(() => {
    const listener = handleQueenEvent(redirect);
    window.addEventListener('QUEEN', listener);
    return () => {
      window.removeEventListener('QUEEN', listener);
    };
  }, [history]);
}
