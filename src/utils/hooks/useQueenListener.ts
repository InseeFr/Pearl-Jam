import { addNewState } from 'utils/functions/surveyUnitState';
import questionnaireEnum, { QuestionnaireStateType } from 'utils/enum/QuestionnaireStateEnum';
import { surveyUnitIDBService } from 'utils/indexeddb/services/surveyUnit-idb-service';
import { surveyUnitStateEnum } from 'utils/enum/SUStateEnum';
import { useEffect } from 'react';
import { persistSurveyUnit } from '../functions';
import { ID } from 'utils/indexeddb/services/abstract-idb-service';
import { QueenEvent } from 'types/events';
import { NavigateFunction } from 'react-router-dom';

const computeSurveyUnitState = (questionnaireState: QuestionnaireStateType) => {
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

const updateSurveyUnit = (surveyUnitID: ID, queenState: QuestionnaireStateType) => {
  surveyUnitIDBService.getById(surveyUnitID).then(su => {
    let newQuestionnaireState: QuestionnaireStateType | '' = '';
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

    if (newQuestionnaireState !== '') {
      const newStateType = computeSurveyUnitState(newQuestionnaireState);
      const newStates = addNewState(su, newStateType);
      persistSurveyUnit({ ...su, states: newStates });
    }
  });
};

const closeQueen = (navigate: NavigateFunction) => (surveyUnitID: string, search?: string) => {
  navigate({ pathname: `/survey-unit/${surveyUnitID}/details`, search });
};

// eslint-disable-next-line consistent-return
const handleQueenEvent = (navigate: NavigateFunction) => async (event: QueenEvent) => {
  const { type, command, ...other } = event.detail;
  if (type === 'QUEEN') {
    switch (command) {
      case 'CLOSE_QUEEN':
        closeQueen(navigate)(other.interrogationId);
        break;
      case 'REGAINED_CONTROL_DONE':
        closeQueen(navigate)(
          other.interrogationId,
          '?tab=goToQuestionnairesPage&feedback=regainedControlDone'
        );
        break;
      case 'UPDATE_STATE':
        updateSurveyUnit(other.interrogationId, other.state);
        globalThis.dispatchEvent(new CustomEvent('pearl-update'));
        break;
      default:
        break;
    }
  }
};

export function useQueenListener(navigate: NavigateFunction) {
  useEffect(() => {
    const listener = handleQueenEvent(navigate);
    globalThis.addEventListener('QUEEN', listener);
    return () => {
      globalThis.removeEventListener('QUEEN', listener);
    };
  }, [history]);
}
