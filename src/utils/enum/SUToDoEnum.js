import D from 'i18n';

const toDoEnum = {
  NOT_STARTED: { order: 1, value: `${D.toDoPrepare}` },
  CONTACT: { order: 2, value: `${D.toDoContact}` },
  SURVEY: { order: 3, value: `${D.toDoSurvey}` },
  TRANSMIT: { order: 4, value: `${D.toDoTransmit}` },
  SYNCHRONIZE: { order: 5, value: `${D.toDoSynchronize}` },
  TERMINATED: { order: 6, value: `${D.toDoTerminated}` },
  FINALIZE: { order: 10, value: `${D.toDoFinalize}` },
};

export default toDoEnum;
