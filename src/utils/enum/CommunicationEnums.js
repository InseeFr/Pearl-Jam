import D from 'i18n';

// Communication Medium
export const communicationMediumEnum = {
  MEDIUM_MAIL: { value: 'LETTER', label: `${D.mediumMail}` },
  MEDIUM_EMAIL: { value: 'EMAIL', label: `${D.mediumEmail}` },
};

export const findCommunicationMediumLabelByValue = value =>
  Object.values(communicationMediumEnum).filter(comMedium => comMedium.value === value)?.[0]?.label;

// Type of communication
export const communicationTypeEnum = {
  COMMUNICATION_NOTICE: { value: 'NOTICE', label: `${D.communicationNotification}` },
  COMMUNICATION_REMINDER: { value: 'REMINDER', label: `${D.communicationReminder}` },
};

export const findCommunicationTypeLabelByValue = value =>
  Object.values(communicationTypeEnum).filter(comType => comType.value === value)?.[0]?.label;

// Reason for sending
export const communicationReasonEnum = {
  UNREACHABLE: { value: 'UNREACHABLE', label: `${D.communicationMotiveUnreachable}` },
  REFUSAL: { value: 'REFUSAL', label: `${D.communicationMotiveRefusal}` },
};
export const findCommunicationReasonLabelByValue = value =>
  Object.values(communicationReasonEnum).filter(comReason => comReason.value === value)?.[0]?.label;

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

// emitter
export const communicationEmiterEnum = {
  INTERVIEWER: 'INTERVIEWER',
  TOOL: 'TOOL',
};
