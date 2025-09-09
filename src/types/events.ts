import { QuestionnaireStateType } from 'utils/enum/QuestionnaireStateEnum';

declare global {
  interface WindowEventMap {
    QUEEN: QueenEvent;
    '[Drama Queen] navigated': CustomEvent<unknown>;
  }
}

type QueenEventDetail = {
  type: string;
  command: string;
  interrogationId: string;
  state: QuestionnaireStateType;
};
export interface QueenEvent extends CustomEvent<QueenEventDetail> {}
