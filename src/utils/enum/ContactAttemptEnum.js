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

export const findContactAttemptValueByType = type => {
  if (type === undefined) return undefined;
  const retour = Object.keys(contactAttemptEnum)
    .map(key => contactAttemptEnum[key])
    .filter(value => value.type === type);
  return retour[0].value;
};
