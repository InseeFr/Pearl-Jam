import D from 'i18n';

// Communication Medium
export const communicationMediumEnum = {
  MEDIUM_MAIL: { type: 'MAIL', value: `${D.mediumMail}` },
  MEDIUM_EMAIL: { type: 'EMAIL', value: `${D.mediumEmail}` },
};

export const findCommunicationMediumValueByType = type =>
  Object.values(communicationMediumEnum).filter(value => value.type === type)?.[0]?.value;

// Type of communication
export const communicationTypeEnum = {
  COMMUNICATION_NOTICE: { type: 'NOTICE', value: `${D.communicationNotification}` },
  COMMUNICATION_REMINDER: { type: 'REMINDER', value: `${D.communicationReminder}` },
};
export const findCommunicationTypeValueByType = type =>
  Object.values(communicationTypeEnum).filter(value => value.type === type)?.[0]?.value;

// Reason for sending
export const communicationReasonEnum = {
  UNREACHABLE: { type: 'UNREACHABLE', value: `${D.communicationMotiveUnreachable}` },
  REFUSAL: { type: 'REFUSAL', value: `${D.communicationMotiveRefusal}` },
};
export const findCommunicationReasonValueByType = type =>
  Object.values(communicationReasonEnum).filter(value => value.type === type)?.[0]?.value;

// Communication status
export const communicationStatusEnum = {
  INITIATED: { type: 'INITIATED', value: `${D.communicationStatusInit}` },
  READY: { type: 'READY', value: `${D.communicationStatusReady}` },
  SUBMITTED: { type: 'SUBMITTED', value: `${D.communicationStatusSubmitted}` },
  FAILED: { type: 'FAILED', value: `${D.communicationStatusFailed}` },
  UNDELIVERED: { type: 'UNDELIVERED', value: `${D.communicationStatusUndelivered}` },
  CANCELLED: { type: 'CANCELLED', value: `${D.communicationStatusCancelled}` },
};
export const findCommunicationStatusValueByType = type =>
  Object.values(communicationStatusEnum).filter(value => value.type === type)?.[0]?.value;

// Emiter
export const communicationEmiterEnum = {
  INTERVIEWER: 'INTERVIEWER',
  TOOL: 'TOOL',
};
