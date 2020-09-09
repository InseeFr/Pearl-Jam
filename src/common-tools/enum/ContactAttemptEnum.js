import D from 'i18n';

const contactAttempt = {
  NO_CONTACT: { type: 'NOC', value: `${D.noContact}` },
  INTERVIEW_ACCEPTED: { type: 'INA', value: `${D.interviewAccepted}` },
  APPOINTMENT_MADE: { type: 'APT', value: `${D.appointmentMade}` },
  REFUSAL: { type: 'REF', value: `${D.refusal}` },
  OCCASIONAL_ABSENCE_OF_INTERVIEWEE: { type: 'ABS', value: `${D.occasionalAbsence}` },
  INTERVIEW_IMPOSSIBLE: { type: 'INI', value: `${D.interviewImpossible}` },
  ALREADY_ANSWERED_IN_ANOTHER_MODE: { type: 'ALA', value: `${D.alreadyAnsweredAnotherMode}` },
  WISH_TO_ANSWER_IN_ANOTHER_MODE: { type: 'WAM', value: `${D.wishAnswerAnotherMode}` },
};

export default contactAttempt;

export const findContactAttemptValueByType = type => {
  if (type === undefined) return undefined;
  const retour = Object.keys(contactAttempt)
    .map(key => contactAttempt[key])
    .filter(value => value.type === type);
  return retour[0].value;
};
