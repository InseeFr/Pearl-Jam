import { addNewState } from 'utils/functions/surveyUnitFunctions';
import questionnaireEnum, { QuestionnaireStateType } from 'utils/enum/QuestionnaireStateEnum';
import { surveyUnitIDBService } from 'utils/indexeddb/services/surveyUnit-idb-service';
import { surveyUnitStateEnum } from 'utils/enum/SUStateEnum';
import { useEffect } from 'react';
import { persistSurveyUnit } from '../functions';
import { ID } from 'utils/indexeddb/services/abstract-idb-service';

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

const closeQueen = (redirect: (url: string) => void) => (surveyUnitID: string) => {
  redirect(`/survey-unit/${surveyUnitID}/details`);
};

// eslint-disable-next-line consistent-return
const handleQueenEvent = (redirect: (url: string) => void) => async (event: QueenEvent) => {
  const { type, command, ...other } = event.detail;
  if (type === 'QUEEN') {
    switch (command) {
      case 'CLOSE_QUEEN':
        closeQueen(redirect)(other.interrogationId);
        break;
      case 'UPDATE_STATE':
        await updateSurveyUnit(other.interrogationId, other.state);
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

declare global {
  interface WindowEventMap {
    QUEEN: QueenEvent;
  }
}

type QueenEventDetail = {
  type: string;
  command: string;
  interrogationId: string;
  state: QuestionnaireStateType;
};
interface QueenEvent extends CustomEvent<QueenEventDetail> {}

export function useQueenListener(redirect: (url: string) => void) {
  useEffect(() => {
    const listener = handleQueenEvent(redirect);
    window.addEventListener('QUEEN', listener);
    return () => {
      window.removeEventListener('QUEEN', listener);
    };
  }, [history]);
}
