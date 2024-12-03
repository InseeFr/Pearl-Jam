import D from 'i18n';

export const contactAttemptEnum = {
  INTERVIEW_ACCEPTED: { type: 'INA', value: `${D.interviewAccepted}` },
  APPOINTMENT_MADE: { type: 'APT', value: `${D.appointmentMade}` },
  REFUSAL: { type: 'REF', value: `${D.refusal}` },
  TEMPORARY_UNAVAILABLE: { type: 'TUN', value: `${D.temporaryUnavailable}` },
  NO_CONTACT: { type: 'NOC', value: `${D.noContact}` },
  MESSAGE_SENT: { type: 'MES', value: `${D.messageSent}` },
  UNUSABLE_CONTACT_DATA: { type: 'UCD', value: `${D.unusableContactData}` },
  PERMANENTLY_UNAVAILABLE: { type: 'PUN', value: `${D.permanentlyUnavailable}` },
  NOTICE_OF_PASSAGE_SENT: { type: 'NPS', value: `${D.noticeOfPassageSent}` },
  NOTIFICATION_LETTER_HAND_DELIVERED: {
    type: 'NLH',
    value: `${D.notificationLetterHandDelivered}`,
  },
};

export const findContactAttemptValueByType = (type: string) =>
  Object.values(contactAttemptEnum).filter(value => value.type === type)?.[0]?.value;

const commonPhoneContactAttemptEnum = {
  APPOINTMENT_MADE: contactAttemptEnum.APPOINTMENT_MADE,
  MESSAGE_SENT: contactAttemptEnum.MESSAGE_SENT,
  REFUSAL: contactAttemptEnum.REFUSAL,
  TEMPORARY_UNAVAILABLE: contactAttemptEnum.TEMPORARY_UNAVAILABLE,
  NO_CONTACT: contactAttemptEnum.NO_CONTACT,
  UNUSABLE_CONTACT_DATA: contactAttemptEnum.UNUSABLE_CONTACT_DATA,
  PERMANENTLY_UNAVAILABLE: contactAttemptEnum.PERMANENTLY_UNAVAILABLE,
};
const mailContactAttemptEnum = {
  APPOINTMENT_MADE: contactAttemptEnum.APPOINTMENT_MADE,
  MESSAGE_SENT: contactAttemptEnum.MESSAGE_SENT,
  REFUSAL: contactAttemptEnum.REFUSAL,
  UNUSABLE_CONTACT_DATA: contactAttemptEnum.UNUSABLE_CONTACT_DATA,
  PERMANENTLY_UNAVAILABLE: contactAttemptEnum.PERMANENTLY_UNAVAILABLE,
};
const fieldContactAttemptEnum = {
  INTERVIEW_ACCEPTED: contactAttemptEnum.INTERVIEW_ACCEPTED,
  APPOINTMENT_MADE: contactAttemptEnum.APPOINTMENT_MADE,
  NOTIFICATION_LETTER_HAND_DELIVERED: contactAttemptEnum.NOTIFICATION_LETTER_HAND_DELIVERED,
  NOTICE_OF_PASSAGE_SENT: contactAttemptEnum.NOTICE_OF_PASSAGE_SENT,
  REFUSAL: contactAttemptEnum.REFUSAL,
  TEMPORARY_UNAVAILABLE: contactAttemptEnum.TEMPORARY_UNAVAILABLE,
  NO_CONTACT: contactAttemptEnum.NO_CONTACT,
  PERMANENTLY_UNAVAILABLE: contactAttemptEnum.PERMANENTLY_UNAVAILABLE,
};

export const getContactAttemptByConfiguration = (configuration: string, medium: string) => {
  switch (medium) {
    case 'FIELD':
      return fieldContactAttemptEnum;
    case 'TEL':
      switch (configuration) {
        case 'TEL':
          return {
            INTERVIEW_ACCEPTED: contactAttemptEnum.INTERVIEW_ACCEPTED,
            ...commonPhoneContactAttemptEnum,
          };
        case 'F2F':
        default:
          return commonPhoneContactAttemptEnum;
      }
    case 'EMAIL':
      return mailContactAttemptEnum;
    default:
      break;
  }
};
