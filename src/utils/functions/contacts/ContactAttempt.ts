import D from 'i18n';
import { ContactOutcomeConfiguration } from './ContactOutcome';

export type ContactAttemptConfiguration = 'F2F' | 'TEL';
export type ContactAttemptMedium = 'TEL' | 'EMAIL' | 'FIELD';
export type ContactAttempts = Record<
  ContactAttemptProperties,
  { value: ContactAttemptValue; label: string; mediums: ContactAttemptMedium[] }
>;

export type ContactAttemptProperties =
  | 'INTERVIEW_ACCEPTED'
  | 'APPOINTMENT_MADE'
  | 'MESSAGE_SENT'
  | 'REFUSAL'
  | 'TEMPORARY_UNAVAILABLE'
  | 'NO_CONTACT'
  | 'UNUSABLE_CONTACT_DATA'
  | 'PERMANENTLY_UNAVAILABLE'
  | 'NOTICE_OF_PASSAGE_SENT'
  | 'NOTIFICATION_LETTER_HAND_DELIVERED';

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

export const contactAttempts: ContactAttempts = {
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

export const filteredContactAttempts = (
  contactAttemptConfiguration: ContactAttemptConfiguration,
  medium: ContactAttemptMedium
): Partial<ContactAttempts> => {
  const { INTERVIEW_ACCEPTED, ...filtered } = contactAttempts;
  if (medium === 'TEL' && contactAttemptConfiguration === 'F2F') return filtered;

  if (
    medium === 'EMAIL' &&
    (contactAttemptConfiguration === 'TEL' || contactAttemptConfiguration === 'F2F')
  )
    return filtered;

  return contactAttempts;
};

export const mediumEnum = {
  EMAIL: { value: 'EMAIL', label: `${D.mediumEmail}` },
  TEL: { value: 'TEL', label: `${D.mediumPhone}` },
  FIELD: { value: 'FIELD', label: `${D.mediumFaceToFace}` },
} as const;

export const findMediumLabelByValue = (value: string) =>
  Object.values(mediumEnum).filter(medium => medium.value === value)?.[0]?.label;

export const getMediumByConfiguration = (configuration?: ContactAttemptConfiguration) => {
  if (configuration === 'F2F') return [mediumEnum.FIELD, mediumEnum.TEL, mediumEnum.EMAIL];
  if (configuration === 'TEL') return [mediumEnum.TEL, mediumEnum.EMAIL];

  return [];
};

export const findContactAttemptLabelByValue = (value: ContactAttemptValue) =>
  Object.values(contactAttempts).filter(ca => ca.value === value)?.[0]?.label;

export const getContactAttemptsByMedium = (
  contactAttemptConfiguration: ContactAttemptConfiguration,
  medium?: ContactAttemptMedium
) => {
  if (!medium) return [];

  const filteredAttemps = filteredContactAttempts(contactAttemptConfiguration, medium);

  return Object.values(filteredAttemps)
    .filter(attempt => attempt.mediums.includes(medium))
    .map(({ value, label }) => ({ value, label }));
};
