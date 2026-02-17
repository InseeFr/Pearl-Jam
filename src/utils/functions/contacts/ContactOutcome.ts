import D from 'i18n';

export const deprecatedContactOutcomes = {
  DECEASED: { value: 'DCD', label: '' },
  DEFINITLY_UNAVAILABLE_FOR_UNKNOWN_REASON: { value: 'DUU', label: '' },
  NO_LONGER_USED_FOR_HABITATION: { value: 'NUH', label: `${D.noLongerUsedForHabitation}` },
} as const;

export const contactOutcomes = {
  INTERVIEW_ACCEPTED: { value: 'INA', label: `${D.interviewAccepted}` },
  REFUSAL: { value: 'REF', label: `${D.refusal}` },
  IMPOSSIBLE_TO_REACH: { value: 'IMP', label: `${D.impossibleReach}` },
  UNUSABLE_CONTACT_DATA: { value: 'UCD', label: `${D.unusableContactData}` },
  UNABLE_TO_RESPOND: { value: 'UTR', label: `${D.unableToRespond}` },
  ALREADY_ANSWERED: { value: 'ALA', label: `${D.alreadyAnsweredAnotherMode}` },
  DEFINITLY_UNAVAILABLE: {
    value: 'DUK',
    label: `${D.definitlyUnavailable}`,
  },
  NOT_APPLICABLE: { value: 'NOA', label: `${D.notApplicable}` },
  UNTREATED_INTERVIEWER_ABSENT: { value: 'NPA', label: `${D.untreatedInterviewerAbsent}` },
  UNTREATED_INTERVIEWER_PRESENT: {
    value: 'NPI',
    label: `${D.untreatedInterviewerPresent}`,
  },
  UNTREATED_EXCEPTIONAL_CAUSE: { value: 'NPX', label: `${D.untreatedExceptionalCause}` },
  RIGHT_OF_WITHDRAWAL: { value: 'ROW', label: `${D.rightOfWithdrawal}` },
} as const;

export type ContactOutcomeValue =
  | (typeof contactOutcomes)[keyof typeof contactOutcomes]['value']
  | (typeof deprecatedContactOutcomes)[keyof typeof deprecatedContactOutcomes]['value'];

export const findContactOutcomeLabelByValue = (value?: ContactOutcomeValue) =>
  Object.values(contactOutcomes).find(co => co.value === value)?.label;

export const findDeprecatedContactOutcomeByValue = (value?: ContactOutcomeValue) => {
  const key = Object.keys(deprecatedContactOutcomes)
    .find(
      key =>
        deprecatedContactOutcomes[key as keyof typeof deprecatedContactOutcomes].value === value
    )
    ?.toString() as keyof typeof deprecatedContactOutcomes;

  if (!key || Object.keys(commonContactOutcomes).includes(key)) return {};

  return { [key]: deprecatedContactOutcomes[key] };
};

export type ContactOutcomeConfiguration = 'TEL' | 'F2F';

export const commonContactOutcomes = {
  INTERVIEW_ACCEPTED: contactOutcomes.INTERVIEW_ACCEPTED,
  REFUSAL: contactOutcomes.REFUSAL,
  IMPOSSIBLE_TO_REACH: contactOutcomes.IMPOSSIBLE_TO_REACH,
  UNABLE_TO_RESPOND: contactOutcomes.UNABLE_TO_RESPOND,
  ALREADY_ANSWERED: contactOutcomes.ALREADY_ANSWERED,
  UNUSABLE_CONTACT_DATA: contactOutcomes.UNUSABLE_CONTACT_DATA,
  DEFINITLY_UNAVAILABLE: contactOutcomes.DEFINITLY_UNAVAILABLE,
  NOT_APPLICABLE: contactOutcomes.NOT_APPLICABLE,
};

type ContactOutcome = {
  value: ContactOutcomeValue;
  label: string;
};

export const getContactOutcomeByConfiguration = (
  configuration: ContactOutcomeConfiguration,
  selectedOutcomeValue?: ContactOutcomeValue
): Record<string, ContactOutcome> => {
  let newContactOutcomes: Record<string, ContactOutcome> = commonContactOutcomes;
  if (configuration === 'TEL') {
    newContactOutcomes = {
      ...newContactOutcomes,
      NO_LONGER_USED_FOR_HABITATION: deprecatedContactOutcomes.NO_LONGER_USED_FOR_HABITATION,
    };
  }
  const selectedOutcome = findDeprecatedContactOutcomeByValue(selectedOutcomeValue);
  if (configuration === 'TEL' || configuration === 'F2F')
    return {
      ...newContactOutcomes,
      ...selectedOutcome,
    };
  return {};
};
