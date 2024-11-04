import D from 'i18n';

// Communication Medium
export const communicationMediumEnum = {
  MEDIUM_MAIL: { value: 'LETTER', label: `${D.mediumMail}` },
  MEDIUM_EMAIL: { value: 'EMAIL', label: `${D.mediumEmail}` },
} as const;

export const findCommunicationMediumLabelByValue = (value: string) =>
  Object.values(communicationMediumEnum).filter(comMedium => comMedium.value === value)?.[0]?.label;

// Type of communication
export const communicationTypeEnum = {
  COMMUNICATION_NOTICE: { value: 'NOTICE', label: `${D.communicationNotification}` },
  COMMUNICATION_REMINDER: { value: 'REMINDER', label: `${D.communicationReminder}` },
} as const;

export const findCommunicationTypeLabelByValue = (value: string) =>
  Object.values(communicationTypeEnum).filter(comType => comType.value === value)?.[0]?.label;

// Reason for sending
export const communicationReasonEnum = {
  UNREACHABLE: { value: 'UNREACHABLE', label: `${D.communicationMotiveUnreachable}` },
  REFUSAL: { value: 'REFUSAL', label: `${D.communicationMotiveRefusal}` },
} as const;
export const findCommunicationReasonLabelByValue = (value: string) =>
  Object.values(communicationReasonEnum).filter(comReason => comReason.value === value)?.[0]?.label;

// Communication status
export const communicationStatusEnum = {
  INITIATED: { value: 'INITIATED', label: `${D.communicationStatusInit}` },
  READY: { value: 'READY', label: `${D.communicationStatusReady}` },
  SUBMITTED: { value: 'SUBMITTED', label: `${D.communicationStatusSubmitted}` },
  FAILED: { value: 'FAILED', label: `${D.communicationStatusFailed}` },
  UNDELIVERED: { value: 'UNDELIVERED', label: `${D.communicationStatusUndelivered}` },
  CANCELLED: { value: 'CANCELLED', label: `${D.communicationStatusCancelled}` },
} as const;
export const findCommunicationStatusLabelByValue = (value: string) =>
  Object.values(communicationStatusEnum).filter(comStatus => comStatus.value === value)?.[0]?.label;

// emitter
export const communicationEmitterEnum = {
  INTERVIEWER: 'INTERVIEWER',
  TOOL: 'TOOL',
} as const;
