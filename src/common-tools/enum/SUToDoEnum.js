import D from 'i18n';
import React from 'react';

const toDoEnum = {
  NOT_STARTED: { order: 1, value: '' },
  CONTACT: { order: 2, value: `${D.toDoContact}` },
  SURVEY: { order: 3, value: `${D.toDoSurvey}` },
  FINALIZE: { order: 4, value: `${D.toDoFinalize}` },
  TRANSMIT: { order: 5, value: `${D.toDoTransmit}` },
  SYNCHRONIZE: { order: 6, value: `${D.toDoSynchronize}` },
  TERMINATED: {
    order: 7,
    value: `${(<i className="fa fa-check" aria-hidden="true" />)}`,
  },
};

export default toDoEnum;
