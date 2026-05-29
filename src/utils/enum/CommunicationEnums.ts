import D from 'i18n';

// Communication Medium
export const communicationMediumEnum = {
  MEDIUM_MAIL: { value: 'LETTER', label: `${D.mediumMail}` },
  MEDIUM_EMAIL: { value: 'EMAIL', label: `${D.mediumEmail}` },
};

export const findCommunicationMediumLabelByValue = (value?: string) =>
  Object.values(communicationMediumEnum).find(comMedium => comMedium.value === value)?.label;

// Type of communication
export const communicationTypeEnum = {
  COMMUNICATION_NOTICE: { value: 'NOTICE', label: `${D.communicationNotification}` },
  COMMUNICATION_REMINDER: { value: 'REMINDER', label: `${D.communicationReminder}` },
};

export const findCommunicationTypeLabelByValue = (value?: string) =>
  Object.values(communicationTypeEnum).find(comType => comType.value === value)?.label;

// Reason for sending
export const communicationReasonEnum = {
  UNREACHABLE: { value: 'UNREACHABLE', label: `${D.communicationMotiveUnreachable}` },
  REFUSAL: { value: 'REFUSAL', label: `${D.communicationMotiveRefusal}` },
};
export const findCommunicationReasonLabelByValue = (value: string | undefined) =>
  Object.values(communicationReasonEnum).find(comReason => comReason.value === value)?.label;

// Communication status
export const communicationStatusEnum = {
  INITIATED: { value: 'INITIATED', label: `${D.communicationStatusInit}` },
  READY: { value: 'READY', label: `${D.communicationStatusReady}` },
  SUBMITTED: { value: 'SUBMITTED', label: `${D.communicationStatusSubmitted}` },
  FAILED: { value: 'FAILED', label: `${D.communicationStatusFailed}` },
  UNDELIVERED: { value: 'UNDELIVERED', label: `${D.communicationStatusUndelivered}` },
  CANCELLED: { value: 'CANCELLED', label: `${D.communicationStatusCancelled}` },
};
export const findCommunicationStatusLabelByValue = (value: string) =>
  Object.values(communicationStatusEnum).find(comStatus => comStatus.value === value)?.label;

// emitter
export const communicationEmitterEnum = {
  INTERVIEWER: 'INTERVIEWER',
  TOOL: 'TOOL',
};
