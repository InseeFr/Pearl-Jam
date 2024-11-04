import D from 'i18n';

export const contactOutcomeEnum = {
  INTERVIEW_ACCEPTED: { type: 'INA', value: `${D.interviewAccepted}` },
  REFUSAL: { type: 'REF', value: `${D.refusal}` },
  IMPOSSIBLE_TO_REACH: { type: 'IMP', value: `${D.impossibleReach}` },
  UNUSABLE_CONTACT_DATA: { type: 'UCD', value: `${D.unusableContactData}` },
  UNABLE_TO_RESPOND: { type: 'UTR', value: `${D.unableToRespond}` },
  ALREADY_ANSWERED: { type: 'ALA', value: `${D.alreadyAnsweredAnotherMode}` },
  DECEASED: { type: 'DCD', value: `${D.deceased}` },
  DEFINITLY_UNAVAILABLE_FOR_KNOWN_REASON: {
    type: 'DUK',
    value: `${D.definitlyUnavailableForKnownReason}`,
  },
  DEFINITLY_UNAVAILABLE_FOR_UNKNOWN_REASON: {
    type: 'DUU',
    value: `${D.definitlyUnavailableForUnknownReason}`,
  },
  NO_LONGER_USED_FOR_HABITATION: { type: 'NUH', value: `${D.noLongerUsedForHabitation}` },
  NOT_APPLICABLE: { type: 'NOA', value: `${D.notApplicable}` },
} as const;

export const findContactOutcomeValueByType = (type: string) =>
  Object.values(contactOutcomeEnum).find(value => value.type === type)?.value;

const commonContactOutcomes = {
  INTERVIEW_ACCEPTED: contactOutcomeEnum.INTERVIEW_ACCEPTED,
  REFUSAL: contactOutcomeEnum.REFUSAL,
  IMPOSSIBLE_TO_REACH: contactOutcomeEnum.IMPOSSIBLE_TO_REACH,
  UNABLE_TO_RESPOND: contactOutcomeEnum.UNABLE_TO_RESPOND,
  DECEASED: contactOutcomeEnum.DECEASED,
  ALREADY_ANSWERED: contactOutcomeEnum.ALREADY_ANSWERED,
  UNUSABLE_CONTACT_DATA: contactOutcomeEnum.UNUSABLE_CONTACT_DATA,
  DEFINITLY_UNAVAILABLE_FOR_KNOWN_REASON: contactOutcomeEnum.DEFINITLY_UNAVAILABLE_FOR_KNOWN_REASON,
  DEFINITLY_UNAVAILABLE_FOR_UNKNOWN_REASON:
    contactOutcomeEnum.DEFINITLY_UNAVAILABLE_FOR_UNKNOWN_REASON,
} as const;

export const getContactOutcomeByConfiguration = (configuration: string) => {
  switch (configuration) {
    case 'F2F':
      return {
        ...commonContactOutcomes,
        NOT_APPLICABLE: contactOutcomeEnum.NOT_APPLICABLE,
      };
    case 'TEL':
      return {
        ...commonContactOutcomes,
        NO_LONGER_USED_FOR_HABITATION: contactOutcomeEnum.NO_LONGER_USED_FOR_HABITATION,
      };
    default:
      return {};
  }
};
