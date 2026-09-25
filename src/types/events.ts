import { QuestionnaireStateType } from 'utils/enum/QuestionnaireStateEnum';

declare global {
  interface WindowEventMap {
    QUEEN: QueenEvent;
    '[Drama Queen] navigated': CustomEvent<unknown>;
  }
}

type QueenEventDetail = {
  type: string;
  command: 'CLOSE_QUEEN' | 'UPDATE_STATE' | 'REGAINED_CONTROL_DONE';
  interrogationId: string;
  state: QuestionnaireStateType;
};
export interface QueenEvent extends CustomEvent<QueenEventDetail> {}
