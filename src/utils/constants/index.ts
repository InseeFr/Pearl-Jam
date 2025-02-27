import {
  communicationMediumEnum,
  communicationReasonEnum,
  communicationStatusEnum,
  communicationTypeEnum,
} from 'utils/enum/CommunicationEnums';

import D from 'i18n';
import { surveyUnitStateEnum } from 'utils/enum/SUStateEnum';
import { contactAttemps } from 'utils/functions/contacts/ContactAttempt';

export const NOTIFICATION_TYPE_SYNC = 'synchronization';
export const NOTIFICATION_TYPE_MANAGEMENT = 'management';

export const KEYCLOAK = 'keycloak';
export const ANONYMOUS = 'anonymous';

export const PEARL_URL = window.localStorage.getItem('PEARL_URL') ?? '';
export const PEARL_USER_KEY = 'pearl-user';
export const GUEST_PEARL_USER = {
  lastName: 'Guest',
  firstName: 'Amazing',
  id: 'Guest',
  roles: ['Guest'],
};

export const CONFIGURATION_FALLBACK = 'sw-fallback-configuration';

export const JSON_UTF8_HEADER = 'application/json;charset=utf-8';

export const CONTACT_RELATED_STATES = [
  surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type,
  surveyUnitStateEnum.APPOINTMENT_MADE.type,
];

export const CONTACT_SUCCESS_LIST = [
  contactAttemps.INTERVIEW_ACCEPTED.value,
  contactAttemps.APPOINTMENT_MADE.value,
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

export const TITLES = {
  MISS: { type: 'MISS', value: D.titleMiss },
  MISTER: { type: 'MISTER', value: D.titleMister },
};
