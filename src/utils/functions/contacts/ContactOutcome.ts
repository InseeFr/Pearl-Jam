import D from 'i18n';

export const contactOutcomes = {
  INTERVIEW_ACCEPTED: { value: 'INA', label: `${D.interviewAccepted}` },
  REFUSAL: { value: 'REF', label: `${D.refusal}` },
  IMPOSSIBLE_TO_REACH: { value: 'IMP', label: `${D.impossibleReach}` },
  UNUSABLE_CONTACT_DATA: { value: 'UCD', label: `${D.unusableContactData}` },
  UNABLE_TO_RESPOND: { value: 'UTR', label: `${D.unableToRespond}` },
  ALREADY_ANSWERED: { value: 'ALA', label: `${D.alreadyAnsweredAnotherMode}` },
  DECEASED: { value: 'DCD', label: `${D.deceased}` },
  DEFINITLY_UNAVAILABLE_FOR_UNKNOWN_REASON: {
    value: 'DUU',
    label: `${D.definitlyUnavailableForUnknownReason}`,
  },
  NO_LONGER_USED_FOR_HABITATION: { value: 'NUH', label: `${D.noLongerUsedForHabitation}` },
  DEFINITLY_UNAVAILABLE: {
    value: 'DUK',
    label: `${D.definitlyUnavailable}`,
  },
  NOT_APPLICABLE: { value: 'NOA', label: `${D.notApplicable}` },
} as const;

export type ContactOutcomeValue = (typeof contactOutcomes)[keyof typeof contactOutcomes]['value'];

export const findContactOutcomeLabelByValue = (value?: string) =>
  Object.values(contactOutcomes).find(co => co.value === value)?.label;

export const findContactOutcomeByValue = (value?: string) => {
  const key = Object.keys(contactOutcomes)
    .find(key => contactOutcomes[key as keyof typeof contactOutcomes].value === value)
    ?.toString();

  if (!key || Object.keys(commonContactOutcomes).find(ckey => ckey === key)) return {};

  return { key: contactOutcomes[key as keyof typeof contactOutcomes] };
};

let commonContactOutcomes = {
  INTERVIEW_ACCEPTED: contactOutcomes.INTERVIEW_ACCEPTED,
  REFUSAL: contactOutcomes.REFUSAL,
  IMPOSSIBLE_TO_REACH: contactOutcomes.IMPOSSIBLE_TO_REACH,
  UNABLE_TO_RESPOND: contactOutcomes.UNABLE_TO_RESPOND,
  ALREADY_ANSWERED: contactOutcomes.ALREADY_ANSWERED,
  UNUSABLE_CONTACT_DATA: contactOutcomes.UNUSABLE_CONTACT_DATA,
  DEFINITLY_UNAVAILABLE: contactOutcomes.DEFINITLY_UNAVAILABLE,
  NOT_APPLICABLE: contactOutcomes.NOT_APPLICABLE,
};

export const getContactOutcomeByConfiguration = (
  configuration: string,
  selectedOutcomeValue?: string
) => {
  if (configuration === 'TEL') {
    commonContactOutcomes = {
      ...commonContactOutcomes,
      ...{ NO_LONGER_USED_FOR_HABITATION: contactOutcomes.NO_LONGER_USED_FOR_HABITATION },
    };
  }

  // Will be removed when deprecated outcomes will be unused
  const selectedOutcome = findContactOutcomeByValue(selectedOutcomeValue);

  if (configuration === 'TEL' || configuration === 'F2F')
    return {
      ...commonContactOutcomes,
      ...selectedOutcome,
    };

  return {};
};
