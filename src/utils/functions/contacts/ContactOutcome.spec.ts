import { describe, it, expect } from 'vitest';
import {
  commonContactOutcomes,
  contactOutcomes,
  findContactOutcomeLabelByValue,
  findOldContactOutcomeByValue,
  getContactOutcomeByConfiguration,
} from './ContactOutcome';
import D from 'i18n';

const findContactOutcomeLabelByValueTests = [
  { input: contactOutcomes.INTERVIEW_ACCEPTED.value, output: D.interviewAccepted },
];

describe('findContactOutcomeLabelByValue', () => {
  findContactOutcomeLabelByValueTests.map(({ input, output }) => {
    it(`findContactOutcomeLabelByValue should return ${output} when adding ${input}`, () => {
      expect(findContactOutcomeLabelByValue(input)).toBe(output);
    });
  });
});

const findContactOutcomeByValueTests = [
  { input: contactOutcomes.INTERVIEW_ACCEPTED.value, output: {} },
  {
    input: contactOutcomes.NO_LONGER_USED_FOR_HABITATION.value,
    output: {
      NO_LONGER_USED_FOR_HABITATION: {
        value: 'NUH',
        label: `${D.noLongerUsedForHabitation}`,
      },
    },
  },
] as const;

describe('findContactOutcomeByValue', () => {
  findContactOutcomeByValueTests.map(({ input, output }) => {
    it(`findContactOutcomeByValue should return ${JSON.stringify(output)} when adding ${input}`, () => {
      expect(findOldContactOutcomeByValue(input)).toEqual(output);
    });
  });
});

const contactOutcomeByConfigTests = [
  {
    input: { configuration: 'TEL', value: undefined },
    output: {
      ...commonContactOutcomes,
      ...{ NO_LONGER_USED_FOR_HABITATION: contactOutcomes.NO_LONGER_USED_FOR_HABITATION },
    },
  },
  {
    input: { configuration: 'F2F', value: 'DUU' },
    output: {
      ...commonContactOutcomes,
      ...{
        DEFINITLY_UNAVAILABLE_FOR_UNKNOWN_REASON:
          contactOutcomes.DEFINITLY_UNAVAILABLE_FOR_UNKNOWN_REASON,
      },
    },
  },
] as const;

describe('getContactOutcomeByConfiguration', () => {
  contactOutcomeByConfigTests.map(({ input, output }) => {
    it(`getContactOutcomeByConfiguration should return expected outcome when adding ${JSON.stringify(input)}`, () => {
      expect(getContactOutcomeByConfiguration(input.configuration, input.value)).toEqual(output);
    });
  });
});
