import D from 'i18n';

const questionnaireState = {
  COMPLETED: { type: 'COMPLETED', value: `${D.questionnaireStateMessageCompleted}` },
  STARTED: {
    type: 'STARTED',
    value: `${D.questionnaireStateAtLeastOneVariableEntered}`,
  },
  VALIDATED: { type: 'VALIDATED', value: `${D.questionnaireStateValidated}` },
} as const;

export type QuestionnaireState = typeof questionnaireState;
export type QuestionnaireStateType = keyof QuestionnaireState;
export default questionnaireState;
