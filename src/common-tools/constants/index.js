import contactAttemptEnum from 'common-tools/enum/ContactAttemptEnum';
import surveyUnitStateEnum from 'common-tools/enum/SUStateEnum';

export const KEYCLOAK = 'keycloak';
export const ANONYMOUS = 'anonymous';
export const AUTHENTICATION_MODE_ENUM = [ANONYMOUS, KEYCLOAK];

export const PEARL_URL = window.localStorage.getItem('PEARL_URL') || '';
export const PEARL_USER_KEY = 'pearl-user';
export const GUEST_PEARL_USER = {
  lastName: 'Guest',
  firstName: 'Guest',
  id: 'Guest',
  roles: ['Guest'],
};
export const JSON_UTF8_HEADER = 'application/json;charset=utf-8';

export const PREVIOUS_STATES_TO_BE_KEEPED = [
  surveyUnitStateEnum.WAITING_FOR_TRANSMISSION.type,
  surveyUnitStateEnum.QUESTIONNAIRE_STARTED.type,
];

export const CONTACT_RELATED_STATES = [
  surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type,
  surveyUnitStateEnum.APPOINTMENT_MADE.type,
];

export const CONTACT_SUCCESS_LIST = [
  contactAttemptEnum.INTERVIEW_ACCEPTED.type,
  contactAttemptEnum.APPOINTMENT_MADE.type,
];

export const STATES_ACCEPTING_ANY_NEW_STATE = [
  surveyUnitStateEnum.IN_PREPARATION.type,
  surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type,
  surveyUnitStateEnum.APPOINTMENT_MADE.type,
  surveyUnitStateEnum.VISIBLE_NOT_CLICKABLE.type,
  surveyUnitStateEnum.VISIBLE_AND_CLICKABLE.type,
];

export const STATES_UPDATING_TO_WFT = [
  surveyUnitStateEnum.WAITING_FOR_TRANSMISSION.type,
  surveyUnitStateEnum.WAITING_FOR_SYNCHRONIZATION.type,
  surveyUnitStateEnum.TO_BE_REVIEWED.type,
  surveyUnitStateEnum.FINALIZED.type,
];
