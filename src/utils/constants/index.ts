import {
  communicationEmiterEnum,
  communicationMediumEnum,
  communicationReasonEnum,
  communicationStatusEnum,
  communicationTypeEnum,
} from 'utils/enum/CommunicationEnums';

import D from 'i18n';
import { contactAttemptEnum } from 'utils/enum/ContactAttemptEnum';
import { surveyUnitStateEnum } from 'utils/enum/SUStateEnum';

export const NOTIFICATION_TYPE_SYNC = 'synchronization';
export const NOTIFICATION_TYPE_MANAGEMENT = 'management';

export const KEYCLOAK = 'keycloak';
export const ANONYMOUS = 'anonymous';
export const AUTHENTICATION_MODE_ENUM = [ANONYMOUS, KEYCLOAK];

export const PEARL_URL = window.localStorage.getItem('PEARL_URL') || '';
export const PEARL_USER_KEY = 'pearl-user';
export const GUEST_PEARL_USER = {
  lastName: 'Guest',
  firstName: 'Amazing',
  id: 'Guest',
  roles: ['Guest'],
};

export const CONFIGURATION_FALLBACK = 'sw-fallback-configuration';

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

export const HEALTHY_COMMUNICATION_REQUEST_STATUS = [
  communicationStatusEnum.INITIATED.value,
  communicationStatusEnum.READY.value,
  communicationStatusEnum.SUBMITTED.value,
];

export const mediumRadioValues = [
  { value: communicationMediumEnum.MEDIUM_MAIL.value, label: D.mediumMail, disabled: false },
  { value: communicationMediumEnum.MEDIUM_EMAIL.value, label: D.mediumEmail, disabled: true },
];

export const typeRadioValues = [
  {
    value: communicationTypeEnum.COMMUNICATION_NOTICE.value,
    label: D.communicationNotification,
    disabled: true,
  },
  {
    value: communicationTypeEnum.COMMUNICATION_REMINDER.value,
    label: D.communicationReminder,
    disabled: false,
  },
];

export const reasonRadioValues = [
  {
    value: communicationReasonEnum.UNREACHABLE.value,
    label: D.communicationMotiveUnreachable,
    disabled: false,
  },
  {
    value: communicationReasonEnum.REFUSAL.value,
    label: D.communicationMotiveRefusal,
    disabled: false,
  },
];

export const EMPTY_COMMUNICATION_REQUEST = {
  medium: '',
  reason: '',
  emiter: communicationEmiterEnum.INTERVIEWER,
  type: communicationTypeEnum.COMMUNICATION_REMINDER.value,
  status: [],
};

export const TITLES = {
  MISS: { type: 'MISS', value: D.titleMiss },
  MISTER: { type: 'MISTER', value: D.titleMister },
};

export const COMMUNICATION_REQUEST_STUB = [
  {
    status: [{ date: 123456789000, status: communicationStatusEnum.FAILED.value }],
    medium: communicationMediumEnum.MEDIUM_MAIL.value,
    type: communicationTypeEnum.COMMUNICATION_REMINDER.value,
    emiter: communicationEmiterEnum.INTERVIEWER,
  },
  {
    status: [{ date: 123456000000, status: communicationStatusEnum.SUBMITTED.value }],
    medium: communicationMediumEnum.MEDIUM_EMAIL.value,
    type: communicationTypeEnum.COMMUNICATION_NOTICE.value,
    emiter: communicationEmiterEnum.TOOL,
  },
];

export const COMMUNICATION_REQUEST_FORM_STEPS = [
  {
    title: D.selectCommunciationRequestMedium,
    valueName: 'medium',
    values: mediumRadioValues,
    previousLabel: D.cancelButton,
    nextLabel: D.confirmButton,
  },
  {
    title: D.selectCommunciationRequestType,
    valueName: 'type',
    values: typeRadioValues,
    previousLabel: D.previousButton,
    nextLabel: D.confirmButton,
  },
  {
    title: D.selectCommunciationRequestReason,
    valueName: 'reason',
    values: reasonRadioValues,
    previousLabel: D.previousButton,
    nextLabel: D.confirmButton,
  },
  {
    title: D.communicationRequestValidation,
    previousLabel: D.previousButton,
    nextLabel: D.sendButton,
  },
];

export const DEFAULT_USER_DATA = {
  id: 'Aidee',
  title: TITLES.MISS.type,
  firstName: 'Int',
  lastName: 'Erviewer',
  email: 'int.erviewer@mai.il',
  phoneNumber: '0123456789',
};
