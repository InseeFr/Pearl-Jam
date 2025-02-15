import D from 'i18n';

export const contactAttemptEnum = {
  INTERVIEW_ACCEPTED: { value: 'INA', label: `${D.interviewAccepted}` },
  APPOINTMENT_MADE: { value: 'APT', label: `${D.appointmentMade}` },
  REFUSAL: { value: 'REF', label: `${D.refusal}` },
  TEMPORARY_UNAVAILABLE: { value: 'TUN', label: `${D.temporaryUnavailable}` },
  NO_CONTACT: { value: 'NOC', label: `${D.noContact}` },
  MESSAGE_SENT: { value: 'MES', label: `${D.messageSent}` },
  UNUSABLE_CONTACT_DATA: { value: 'UCD', label: `${D.unusableContactData}` },
  PERMANENTLY_UNAVAILABLE: { value: 'PUN', label: `${D.permanentlyUnavailable}` },
  NOTICE_OF_PASSAGE_SENT: { value: 'NPS', label: `${D.noticeOfPassageSent}` },
  NOTIFICATION_LETTER_HAND_DELIVERED: {
    value: 'NLH',
    label: `${D.notificationLetterHandDelivered}`,
  },
} as const;

export const findContactAttemptLabelByValue = (value: string) =>
  Object.values(contactAttemptEnum).filter(ca => ca.value === value)?.[0]?.label;

const phoneContactAttemptEnum = {
  INTERVIEW_ACCEPTED: contactAttemptEnum.INTERVIEW_ACCEPTED,
  APPOINTMENT_MADE: contactAttemptEnum.APPOINTMENT_MADE,
  MESSAGE_SENT: contactAttemptEnum.MESSAGE_SENT,
  REFUSAL: contactAttemptEnum.REFUSAL,
  TEMPORARY_UNAVAILABLE: contactAttemptEnum.TEMPORARY_UNAVAILABLE,
  NO_CONTACT: contactAttemptEnum.NO_CONTACT,
  UNUSABLE_CONTACT_DATA: contactAttemptEnum.UNUSABLE_CONTACT_DATA,
  PERMANENTLY_UNAVAILABLE: contactAttemptEnum.PERMANENTLY_UNAVAILABLE,
} as const;
const mailContactAttemptEnum = {
  INTERVIEW_ACCEPTED: contactAttemptEnum.INTERVIEW_ACCEPTED,
  APPOINTMENT_MADE: contactAttemptEnum.APPOINTMENT_MADE,
  MESSAGE_SENT: contactAttemptEnum.MESSAGE_SENT,
  REFUSAL: contactAttemptEnum.REFUSAL,
  UNUSABLE_CONTACT_DATA: contactAttemptEnum.UNUSABLE_CONTACT_DATA,
  PERMANENTLY_UNAVAILABLE: contactAttemptEnum.PERMANENTLY_UNAVAILABLE,
} as const;
const fieldContactAttemptEnum = {
  INTERVIEW_ACCEPTED: contactAttemptEnum.INTERVIEW_ACCEPTED,
  APPOINTMENT_MADE: contactAttemptEnum.APPOINTMENT_MADE,
  NOTIFICATION_LETTER_HAND_DELIVERED: contactAttemptEnum.NOTIFICATION_LETTER_HAND_DELIVERED,
  NOTICE_OF_PASSAGE_SENT: contactAttemptEnum.NOTICE_OF_PASSAGE_SENT,
  REFUSAL: contactAttemptEnum.REFUSAL,
  TEMPORARY_UNAVAILABLE: contactAttemptEnum.TEMPORARY_UNAVAILABLE,
  NO_CONTACT: contactAttemptEnum.NO_CONTACT,
  PERMANENTLY_UNAVAILABLE: contactAttemptEnum.PERMANENTLY_UNAVAILABLE,
} as const;

export const getContactAttemptByConfiguration = (medium: string | null) => {
  switch (medium) {
    case 'FIELD':
      return fieldContactAttemptEnum;
    case 'TEL':
      return phoneContactAttemptEnum;
    case 'EMAIL':
      return mailContactAttemptEnum;
    default:
      return {};
  }
};
