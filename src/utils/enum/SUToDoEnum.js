import D from 'i18n';

/**
 * List available status for a survey unit
 */
export const toDoEnum = {
  NOT_STARTED: { order: '1', value: `${D.toDoPrepare}`, color: '#FF93AA80' },
  CONTACT: { order: '2', value: `${D.toDoContact}`, color: '#F2C94C80' },
  SURVEY: { order: '3', value: `${D.toDoSurvey}`, color: '#F2994A80' },
  TRANSMIT: { order: '4', value: `${D.toDoTransmit}`, color: '#BB6BD966' },
  SYNCHRONIZE: { order: '5', value: `${D.toDoSynchronize}`, color: '#2F80ED4D' },
  TERMINATED: { order: '6', value: `${D.toDoTerminated}`, color: '#35C75880' },
};
