import D from 'i18n';

export const contactOutcomeEnum = {
  INTERVIEW_ACCEPTED: { type: 'INA', value: `${D.interviewAccepted}` },
  REFUSAL: { type: 'REF', value: `${D.refusal}` },
  IMPOSSIBLE_TO_REACH: { type: 'IMP', value: `${D.impossibleReach}` },
  UNUSABLE_CONTACT_DATA: { type: 'UCD', value: `${D.unusableContactData}` },
  UNABLE_TO_RESPOND: { type: 'UTR', value: `${D.unableToRespond}` },
  ALREADY_ANSWERED: { type: 'ALA', value: `${D.alreadyAnsweredAnotherMode}` },
  DECEASED: { type: 'DCD', value: `${D.deceased}` },
  NO_LONGER_USED_FOR_HABITATION: { type: 'NUH', value: `${D.noLongerUsedForHabitation}` },
  DEFINITLY_UNAVAILABLE_FOR_KNOWN_REASON: {
    type: 'DUK',
    value: `${D.definitlyUnavailableForKnownReason}`,
  },
  DEFINITLY_UNAVAILABLE_FOR_UNKNOWN_REASON: {
    type: 'DUU',
    value: `${D.definitlyUnavailableForUnknownReason}`,
  },
  NOT_APPLICABLE: { type: 'NOA', value: `${D.notApplicable}` },
};

export const findContactOutcomeValueByType = type => {
  if (type === undefined) return undefined;
  const retour = Object.keys(contactOutcomeEnum)
    .map(key => contactOutcomeEnum[key])
    .filter(value => value.type === type);
  return retour[0].value;
};
