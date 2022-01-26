import D from 'i18n';

export const surveyUnitStateEnum = {
  VISIBLE_NOT_CLICKABLE: {
    type: 'VIN',
    value: `${D.suStateVisibleNotClickable}`,
  },
  VISIBLE_AND_CLICKABLE: {
    type: 'VIC',
    value: `${D.suStateVisibleAndClickable}`,
  },
  IN_PREPARATION: { type: 'PRC', value: `${D.suStateInPreparation}` },
  AT_LEAST_ONE_CONTACT: { type: 'AOC', value: `${D.suStateAtLeastOneContact}` },
  APPOINTMENT_MADE: { type: 'APS', value: `${D.suStateAppointmentMade}` },
  QUESTIONNAIRE_STARTED: {
    type: 'INS',
    value: `${D.suStateQuestionnaireStarted}`,
  },
  WAITING_FOR_TRANSMISSION: {
    type: 'WFT',
    value: `${D.suStateWaitingForTransmission}`,
  },
  WAITING_FOR_SYNCHRONIZATION: {
    type: 'WFS',
    value: `${D.suStateWaitingForSynchronization}`,
  },
  TO_BE_REVIEWED: {
    type: 'TBR',
    value: `${D.suStateToBeReviewed}`,
  },
  FINALIZED: { type: 'FIN', value: `${D.suStateFinalized}` },
  CLOSED: { type: 'CLO', value: `${D.suStateClosedSurveyUnit}` },
};

export const findSuStateValueByType = type => {
  const retour = Object.keys(surveyUnitStateEnum)
    .map(key => surveyUnitStateEnum[key])
    .filter(value => value.type === type);
  return retour[0].value;
};
