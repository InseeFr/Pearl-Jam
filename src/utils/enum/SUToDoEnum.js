import D from 'i18n';

const toDoEnum = {
  NOT_STARTED: { order: 1, value: `${D.toDoPrepare}` },
  CONTACT: { order: 2, value: `${D.toDoContact}` },
  SURVEY: { order: 3, value: `${D.toDoSurvey}` },
  FINALIZE: { order: 4, value: `${D.toDoFinalize}` },
  TRANSMIT: { order: 5, value: `${D.toDoTransmit}` },
  SYNCHRONIZE: { order: 6, value: `${D.toDoSynchronize}` },
  TERMINATED: { order: 7, value: `${D.toDoTerminated}` },
};

export default toDoEnum;
