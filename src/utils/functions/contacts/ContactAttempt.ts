import D from 'i18n';

export type ContactAttemptConfiguration = 'F2F' | 'TEL';
export type ContactAttempts = Record<
  string,
  { value: ContactAttemptValue; label: string; mediums: ContactAttemptMedium[] }
>;
export type ContactAttemptValue =
  | 'INA'
  | 'APT'
  | 'MES'
  | 'REF'
  | 'TUN'
  | 'NOC'
  | 'UCD'
  | 'PUN'
  | 'NPS'
  | 'NLH';

export const contactAttemps: ContactAttempts = {
  INTERVIEW_ACCEPTED: {
    value: 'INA',
    label: `${D.interviewAccepted}`,
    mediums: ['TEL', 'EMAIL', 'FIELD'],
  },
  APPOINTMENT_MADE: {
    value: 'APT',
    label: `${D.appointmentMade}`,
    mediums: ['TEL', 'EMAIL', 'FIELD'],
  },
  MESSAGE_SENT: {
    value: 'MES',
    label: `${D.messageSent}`,
    mediums: ['TEL', 'EMAIL'],
  },
  REFUSAL: {
    value: 'REF',
    label: `${D.refusal}`,
    mediums: ['TEL', 'EMAIL', 'FIELD'],
  },
  TEMPORARY_UNAVAILABLE: {
    value: 'TUN',
    label: `${D.temporaryUnavailable}`,
    mediums: ['TEL', 'FIELD'],
  },
  NO_CONTACT: {
    value: 'NOC',
    label: `${D.noContact}`,
    mediums: ['TEL', 'FIELD'],
  },
  UNUSABLE_CONTACT_DATA: {
    value: 'UCD',
    label: `${D.unusableContactData}`,
    mediums: ['TEL', 'EMAIL'],
  },
  PERMANENTLY_UNAVAILABLE: {
    value: 'PUN',
    label: `${D.permanentlyUnavailable}`,
    mediums: ['TEL', 'EMAIL', 'FIELD'],
  },
  NOTICE_OF_PASSAGE_SENT: {
    value: 'NPS',
    label: `${D.noticeOfPassageSent}`,
    mediums: ['FIELD'],
  },
  NOTIFICATION_LETTER_HAND_DELIVERED: {
    value: 'NLH',
    label: `${D.notificationLetterHandDelivered}`,
    mediums: ['FIELD'],
  },
};

export const mediumEnum = {
  EMAIL: { value: 'EMAIL', label: `${D.mediumEmail}` },
  TEL: { value: 'TEL', label: `${D.mediumPhone}` },
  FIELD: { value: 'FIELD', label: `${D.mediumFaceToFace}` },
} as const;

export type ContactAttemptMedium = (typeof mediumEnum)[keyof typeof mediumEnum]['value'] | {};

export const findMediumLabelByValue = (value: string) =>
  Object.values(mediumEnum).filter(medium => medium.value === value)?.[0]?.label;

export const getMediumByConfiguration = (configuration?: ContactAttemptConfiguration) => {
  if (configuration === 'F2F') return [mediumEnum.EMAIL, mediumEnum.TEL, mediumEnum.FIELD];
  if (configuration === 'TEL') return [mediumEnum.EMAIL, mediumEnum.TEL];

  return [];
};

export const findContactAttemptLabelByValue = (value: ContactAttemptValue) =>
  Object.values(contactAttemps).filter(ca => ca.value === value)?.[0]?.label;

export const getContactAttemptsByMedium = (medium?: ContactAttemptMedium) => {
  if (!medium) return [];
  return Object.values(contactAttemps)
    .filter(attempt => attempt.mediums?.includes(medium))
    .map(({ value, label }) => ({ value, label }));
};
