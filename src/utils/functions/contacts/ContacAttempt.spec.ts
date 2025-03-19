import { describe, it, expect } from 'vitest';
import {
  mediumEnum,
  findMediumLabelByValue,
  getMediumByConfiguration,
  contactAttempts,
  findContactAttemptLabelByValue,
  getContactAttemptsByMedium,
  ContactAttemptValue,
  ContactAttemptConfiguration,
  ContactAttemptMedium,
  filteredContactAttempts,
  ContactAttempts,
} from './ContactAttempt';
import D from 'i18n';

const mediumLabelTests = [
  { input: 'EMAIL', output: mediumEnum.EMAIL.label },
  { input: 'TEL', output: mediumEnum.TEL.label },
  { input: 'FIELD', output: mediumEnum.FIELD.label },
  { input: 'INVALID', output: undefined },
];

describe('findMediumLabelByValue', () => {
  mediumLabelTests.map(({ input, output }) => {
    it(`findMediumLabelByValue should return ${output} when adding ${input}`, () => {
      expect(findMediumLabelByValue(input)).toBe(output);
    });
  });
});

const mediumByConfigTests = [
  { input: 'F2F', output: [mediumEnum.FIELD, mediumEnum.TEL, mediumEnum.EMAIL] },
  { input: 'TEL', output: [mediumEnum.TEL, mediumEnum.EMAIL] },
] as const;

describe('getMediumByConfiguration', () => {
  mediumByConfigTests.map(({ input, output }) => {
    it(`getMediumByConfiguration should return ${JSON.stringify(output)} when adding ${input}`, () => {
      expect(getMediumByConfiguration(input)).toEqual(output);
    });
  });
});

const findContactAttemptLabelByValueTests = [
  { input: 'INA' as ContactAttemptValue, output: D.interviewAccepted },
];

describe('findContactAttemptLabelByValue', () => {
  findContactAttemptLabelByValueTests.map(({ input, output }) => {
    it(`findContactAttemptLabelByValue should return ${output} when adding ${input}`, () => {
      expect(findContactAttemptLabelByValue(input)).toBe(output);
    });
  });
});

const contactAttemptsByMediumTests = [
  {
    input: { contactAttemptConfiguration: 'TEL' as ContactAttemptConfiguration, medium: undefined },
    output: [],
  },
  {
    input: {
      contactAttemptConfiguration: 'F2F' as ContactAttemptConfiguration,
      medium: 'TEL' as ContactAttemptMedium,
    },
    output: ['APT', 'MES', 'REF', 'TUN', 'NOC', 'UCD', 'PUN'],
  },
  {
    input: {
      contactAttemptConfiguration: 'TEL' as ContactAttemptConfiguration,
      medium: 'TEL' as ContactAttemptMedium,
    },
    output: ['INA', 'APT', 'MES', 'REF', 'TUN', 'NOC', 'UCD', 'PUN'],
  },
  {
    input: {
      contactAttemptConfiguration: 'TEL' as ContactAttemptConfiguration,
      medium: 'EMAIL' as ContactAttemptMedium,
    },
    output: ['APT', 'MES', 'REF', 'UCD', 'PUN'],
  },
] as const;

describe('getContactAttemptsByMedium', () => {
  contactAttemptsByMediumTests.map(({ input, output }) => {
    it(`getContactAttemptsByMedium should return ${JSON.stringify(output)} when adding ${input}`, () => {
      expect(
        getContactAttemptsByMedium(input.contactAttemptConfiguration, input.medium).map(
          ({ value }) => value
        )
      ).toEqual(output);
    });
  });
});

const { INTERVIEW_ACCEPTED, ...filtered } = contactAttempts;

const filteredContactAttemptsTests: {
  input: { contactAttemptConfiguration: ContactAttemptConfiguration; medium: any };
  output: Partial<ContactAttempts>;
}[] = [
  {
    input: { contactAttemptConfiguration: 'TEL', medium: 'TEL' as ContactAttemptMedium },
    output: contactAttempts,
  },
  {
    input: { contactAttemptConfiguration: 'F2F', medium: 'TEL' as ContactAttemptMedium },
    output: filtered,
  },
  {
    input: { contactAttemptConfiguration: 'F2F', medium: 'FIELD' as ContactAttemptMedium },
    output: contactAttempts,
  },
  {
    input: { contactAttemptConfiguration: 'TEL', medium: 'FIELD' as ContactAttemptMedium },
    output: filtered,
  },
  {
    input: { contactAttemptConfiguration: 'TEL', medium: 'EMAIL' as ContactAttemptMedium },
    output: filtered,
  },
  {
    input: { contactAttemptConfiguration: 'F2F', medium: 'EMAIL' as ContactAttemptMedium },
    output: filtered,
  },
];

describe('filteredContactAttempts', () => {
  filteredContactAttemptsTests.map(({ input, output }) => {
    it(`should return ${JSON.stringify(output)} for contactAttemptConfiguration=${input.contactAttemptConfiguration} and medium=${input.medium}`, () => {
      const result = filteredContactAttempts(input.contactAttemptConfiguration, input.medium);
      expect(result).toEqual(output);
    });
  });
});
