import D from 'i18n';

/**
 * List available status for a survey unit
 */
export const toDoEnum = {
  NOT_STARTED: { order: '1', value: D.toDoPrepare, stepName: D.stepPrepared, color: '#FF93AA80' },
  CONTACT: { order: '2', value: D.toDoContact, stepName: D.stepContacted, color: '#F2C94C80' },
  SURVEY: { order: '3', value: D.toDoSurvey, stepName: D.stepSurveyed, color: '#F2994A80' },
  FINALIZE: { order: '4', value: D.toDoFinalize, stepName: D.stepFinalized, color: '#DFD3C3' },
  TRANSMIT: { order: '5', value: D.toDoTransmit, stepName: D.stepTransmitted, color: '#BB6BD966' },
  SYNCHRONIZE: {
    order: '6',
    value: D.toDoSynchronize,
    stepName: D.stepSynchronized,
    color: '#2F80ED4D',
  },
  TERMINATED: {
    order: '7',
    value: D.toDoTerminated,
    stepName: D.stepTerminated,
    color: '#35C75880',
  },
} as const;
