import D from 'i18n';

const surveyUnitState = {
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
  QUESTIONNAIRE_NOT_AVAILABLE: { type: 'QNA', value: `${D.suStateQuestionnaireNotAvailable}` },
};

export default surveyUnitState;

export const findSuStateValueByType = type => {
  const retour = Object.keys(surveyUnitState)
    .map(key => surveyUnitState[key])
    .filter(value => value.type === type);
  return retour[0].value;
};
