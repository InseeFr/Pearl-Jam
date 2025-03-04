import { describe, it, expect } from 'vitest';
import {
  mediumEnum,
  findMediumLabelByValue,
  getMediumByConfiguration,
  contactAttempts,
  findContactAttemptLabelByValue,
  getContactAttemptsByMedium,
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
  { input: 'F2F', output: [mediumEnum.EMAIL, mediumEnum.TEL, mediumEnum.FIELD] },
  { input: 'TEL', output: [mediumEnum.EMAIL, mediumEnum.TEL] },
] as const;

describe('getMediumByConfiguration', () => {
  mediumByConfigTests.map(({ input, output }) => {
    it(`getMediumByConfiguration should return ${JSON.stringify(output)} when adding ${input}`, () => {
      expect(getMediumByConfiguration(input)).toEqual(output);
    });
  });
});

const findContactAttemptLabelByValueTests = [
  { input: contactAttempts.INTERVIEW_ACCEPTED.value, output: D.interviewAccepted },
];

describe('findContactAttemptLabelByValue', () => {
  findContactAttemptLabelByValueTests.map(({ input, output }) => {
    it(`findContactAttemptLabelByValue should return ${output} when adding ${input}`, () => {
      expect(findContactAttemptLabelByValue(input)).toBe(output);
    });
  });
});

const contactAttemptsByMediumTests = [
  { input: 'EMAIL', output: ['INA', 'APT', 'MES', 'REF', 'UCD', 'PUN'] },
  { input: 'TEL', output: ['INA', 'APT', 'MES', 'REF', 'TUN', 'NOC', 'UCD', 'PUN'] },
  { input: 'FIELD', output: ['INA', 'APT', 'REF', 'TUN', 'NOC', 'PUN', 'NPS', 'NLH'] },
  { input: undefined, output: [] },
] as const;

describe('getContactAttemptsByMedium', () => {
  contactAttemptsByMediumTests.map(({ input, output }) => {
    it(`getContactAttemptsByMedium should return ${JSON.stringify(output)} when adding ${input}`, () => {
      expect(getContactAttemptsByMedium(input).map(({ value }) => value)).toEqual(output);
    });
  });
});
