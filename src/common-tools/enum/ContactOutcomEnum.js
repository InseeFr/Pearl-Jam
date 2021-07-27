import D from 'i18n';

const contactOutcome = {
  INTERVIEW_ACCEPTED: { type: 'INA', value: `${D.interviewAccepted}` },
  REFUSAL: { type: 'REF', value: `${D.refusal}` },
  IMPOSSIBLE_TO_REACH: { type: 'IMP', value: `${D.impossibleReach}` },
  UNUSABLE_CONTACT_DATA: { type: 'UCD', value: `${D.unusableContactData}` },
  UNABLE_TO_RESPOND: { type: 'UTR', value: `${D.unableToRespond}` },
  ALREADY_ANSWERED: { type: 'ALA', value: `${D.alreadyAnsweredAnotherMode}` },
  ABSENCE_DURING_COLLECTION: { type: 'ACP', value: `${D.absenceDuringCollection}` },
  DECEASED: { type: 'DCD', value: `${D.deceased}` },
  NO_LONGER_USED_FOR_HABITATION: { type: 'NUH', value: `${D.noLongerUsedForHabitation}` },
  NO_INTERVIEW_FOR_EXCEPTIONNAL_REASONS: {
    type: 'NER',
    value: `${D.noInterviewForExceptionalReasons}`,
  },
};

export default contactOutcome;

export const findContactOutcomeValueByType = type => {
  if (type === undefined) return undefined;
  const retour = Object.keys(contactOutcome)
    .map(key => contactOutcome[key])
    .filter(value => value.type === type);
  return retour[0].value;
};
