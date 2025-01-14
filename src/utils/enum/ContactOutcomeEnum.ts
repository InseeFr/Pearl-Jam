import D from 'i18n';

export const contactOutcomeEnum = {
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

export type ContactOutcomeValue =
  (typeof contactOutcomeEnum)[keyof typeof contactOutcomeEnum]['value'];

export const findContactOutcomeLabelByValue = (value?: string) =>
  Object.values(contactOutcomeEnum).find(co => co.value === value)?.label;

export const findContactOutcomeByValue = (value?: string) => {
  const key = Object.keys(contactOutcomeEnum)
    .find(key => contactOutcomeEnum[key as keyof typeof contactOutcomeEnum].value === value)
    ?.toString();

  if (!key || Object.keys(commonContactOutcomes).find(ckey => ckey === key)) return {};

  return { key: contactOutcomeEnum[key as keyof typeof contactOutcomeEnum] };
};

let commonContactOutcomes = {
  INTERVIEW_ACCEPTED: contactOutcomeEnum.INTERVIEW_ACCEPTED,
  REFUSAL: contactOutcomeEnum.REFUSAL,
  IMPOSSIBLE_TO_REACH: contactOutcomeEnum.IMPOSSIBLE_TO_REACH,
  UNABLE_TO_RESPOND: contactOutcomeEnum.UNABLE_TO_RESPOND,
  ALREADY_ANSWERED: contactOutcomeEnum.ALREADY_ANSWERED,
  UNUSABLE_CONTACT_DATA: contactOutcomeEnum.UNUSABLE_CONTACT_DATA,
  DEFINITLY_UNAVAILABLE: contactOutcomeEnum.DEFINITLY_UNAVAILABLE,
  NOT_APPLICABLE: contactOutcomeEnum.NOT_APPLICABLE,
};

type ContactOutcomeEnum = {
  [key in keyof typeof contactOutcomeEnum]?: (typeof contactOutcomeEnum)[key];
};

export const getContactOutcomeByConfiguration = (
  configuration: string,
  selectedOutcomeValue?: string
): ContactOutcomeEnum => {
  if (configuration === 'TEL') {
    commonContactOutcomes = {
      ...commonContactOutcomes,
      ...{ NO_LONGER_USED_FOR_HABITATION: contactOutcomeEnum.NO_LONGER_USED_FOR_HABITATION },
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
