import { describe, it, expect } from 'vitest';
import { SurveyUnitPhoneNumber } from 'types/pearl';
import { selectPhoneNumber } from './contactHistory';

describe('selectPhoneNumber', () => {
  describe('empty or no phone numbers', () => {
    it.each([
      { input: [], description: 'empty array' },
      { input: undefined as any, description: 'undefined' },
      { input: null as any, description: 'null' },
    ])('returns undefined when phone numbers is $description', ({ input }) => {
      const result = selectPhoneNumber(input);
      expect(result).toEqual({
        phoneNumber: undefined,
        requiresUserSelection: false,
      });
    });
  });

  describe('single phone number scenarios', () => {
    it.each<{
      source: SurveyUnitPhoneNumber['source'];
      favorite: boolean;
    }>([
      { source: 'INTERVIEWER', favorite: false },
      { source: 'INTERVIEWER', favorite: true },
      { source: 'FISCAL', favorite: false },
      { source: 'FISCAL', favorite: true },
      { source: 'DIRECTORY', favorite: false },
      { source: 'DIRECTORY', favorite: true },
    ])('returns the single $source number (favorite: $favorite)', ({ source, favorite }) => {
      const phoneNumbers: SurveyUnitPhoneNumber[] = [
        {
          id: '1',
          source,
          favorite,
          number: '0123456789',
        },
      ];

      const result = selectPhoneNumber(phoneNumbers);
      expect(result).toEqual({
        phoneNumber: '0123456789',
        requiresUserSelection: false,
      });
    });
  });

  describe('favorite phone numbers priority', () => {
    it('prioritizes favorite INTERVIEWER over other favorite sources', () => {
      const phoneNumbers: SurveyUnitPhoneNumber[] = [
        { id: '1', source: 'DIRECTORY', favorite: true, number: 'DIR123' },
        { id: '2', source: 'FISCAL', favorite: true, number: 'FISC123' },
        { id: '3', source: 'INTERVIEWER', favorite: true, number: 'INT123' },
      ];

      const result = selectPhoneNumber(phoneNumbers);
      expect(result).toEqual({
        phoneNumber: 'INT123',
        requiresUserSelection: false,
      });
    });

    it('prioritizes favorite FISCAL over favorite DIRECTORY', () => {
      const phoneNumbers: SurveyUnitPhoneNumber[] = [
        { id: '1', source: 'DIRECTORY', favorite: true, number: 'DIR123' },
        { id: '2', source: 'FISCAL', favorite: true, number: 'FISC123' },
      ];

      const result = selectPhoneNumber(phoneNumbers);
      expect(result).toEqual({
        phoneNumber: 'FISC123',
        requiresUserSelection: false,
      });
    });

    it('returns favorite DIRECTORY when no INTERVIEWER or FISCAL favorites', () => {
      const phoneNumbers: SurveyUnitPhoneNumber[] = [
        { id: '1', source: 'DIRECTORY', favorite: true, number: 'DIR123' },
        { id: '2', source: 'FISCAL', favorite: false, number: 'FISC123' },
      ];

      const result = selectPhoneNumber(phoneNumbers);
      expect(result).toEqual({
        phoneNumber: 'DIR123',
        requiresUserSelection: false,
      });
    });
  });

  describe('multiple INTERVIEWER numbers', () => {
    it('requires user selection when multiple INTERVIEWER numbers without favorite', () => {
      const phoneNumbers: SurveyUnitPhoneNumber[] = [
        { id: '1', source: 'INTERVIEWER', favorite: false, number: 'INT1' },
        { id: '2', source: 'INTERVIEWER', favorite: false, number: 'INT2' },
      ];

      const result = selectPhoneNumber(phoneNumbers);
      expect(result).toEqual({
        requiresUserSelection: true,
      });
    });

    it('requires user selection when multiple INTERVIEWER favorites', () => {
      const phoneNumbers: SurveyUnitPhoneNumber[] = [
        { id: '1', source: 'INTERVIEWER', favorite: true, number: 'INT1' },
        { id: '2', source: 'INTERVIEWER', favorite: true, number: 'INT2' },
      ];

      const result = selectPhoneNumber(phoneNumbers);
      expect(result).toEqual({
        requiresUserSelection: true,
      });
    });

    it('returns single INTERVIEWER favorite when only one is marked favorite', () => {
      const phoneNumbers: SurveyUnitPhoneNumber[] = [
        { id: '1', source: 'INTERVIEWER', favorite: true, number: 'INT1' },
        { id: '2', source: 'INTERVIEWER', favorite: false, number: 'INT2' },
      ];

      const result = selectPhoneNumber(phoneNumbers);
      expect(result).toEqual({
        phoneNumber: 'INT1',
        requiresUserSelection: false,
      });
    });
  });

  describe('fallback priority when no favorites', () => {
    it('prioritizes INTERVIEWER over FISCAL and DIRECTORY', () => {
      const phoneNumbers: SurveyUnitPhoneNumber[] = [
        { id: '1', source: 'DIRECTORY', favorite: false, number: 'DIR123' },
        { id: '2', source: 'FISCAL', favorite: false, number: 'FISC123' },
        { id: '3', source: 'INTERVIEWER', favorite: false, number: 'INT123' },
      ];

      const result = selectPhoneNumber(phoneNumbers);
      expect(result).toEqual({
        phoneNumber: 'INT123',
        requiresUserSelection: false,
      });
    });

    it('prioritizes FISCAL over DIRECTORY when no INTERVIEWER', () => {
      const phoneNumbers: SurveyUnitPhoneNumber[] = [
        { id: '1', source: 'DIRECTORY', favorite: false, number: 'DIR123' },
        { id: '2', source: 'FISCAL', favorite: false, number: 'FISC123' },
      ];

      const result = selectPhoneNumber(phoneNumbers);
      expect(result).toEqual({
        phoneNumber: 'FISC123',
        requiresUserSelection: false,
      });
    });

    it('returns DIRECTORY when only option available', () => {
      const phoneNumbers: SurveyUnitPhoneNumber[] = [
        { id: '1', source: 'DIRECTORY', favorite: false, number: 'DIR123' },
      ];

      const result = selectPhoneNumber(phoneNumbers);
      expect(result).toEqual({
        phoneNumber: 'DIR123',
        requiresUserSelection: false,
      });
    });
  });

  describe('complex scenarios with mixed sources and favorites', () => {
    it('picks favorite INTERVIEWER despite multiple non-favorite INTERVIEWER numbers', () => {
      const phoneNumbers: SurveyUnitPhoneNumber[] = [
        { id: '1', source: 'INTERVIEWER', favorite: false, number: 'INT1' },
        { id: '2', source: 'INTERVIEWER', favorite: true, number: 'INT2' },
        { id: '3', source: 'INTERVIEWER', favorite: false, number: 'INT3' },
        { id: '4', source: 'FISCAL', favorite: false, number: 'FISC123' },
      ];

      const result = selectPhoneNumber(phoneNumbers);
      expect(result).toEqual({
        phoneNumber: 'INT2',
        requiresUserSelection: false,
      });
    });

    it('ignores non-favorite sources when favorite exists', () => {
      const phoneNumbers: SurveyUnitPhoneNumber[] = [
        { id: '1', source: 'INTERVIEWER', favorite: false, number: 'INT1' },
        { id: '2', source: 'INTERVIEWER', favorite: false, number: 'INT2' },
        { id: '3', source: 'DIRECTORY', favorite: true, number: 'DIR123' },
        { id: '4', source: 'FISCAL', favorite: false, number: 'FISC123' },
      ];

      const result = selectPhoneNumber(phoneNumbers);
      expect(result).toEqual({
        phoneNumber: 'DIR123',
        requiresUserSelection: false,
      });
    });

    it('requires selection when multiple INTERVIEWER and favorite FISCAL exists but multiple INT', () => {
      const phoneNumbers: SurveyUnitPhoneNumber[] = [
        { id: '1', source: 'INTERVIEWER', favorite: false, number: 'INT1' },
        { id: '2', source: 'INTERVIEWER', favorite: false, number: 'INT2' },
        { id: '3', source: 'FISCAL', favorite: true, number: 'FISC123' },
      ];

      const result = selectPhoneNumber(phoneNumbers);
      expect(result).toEqual({
        phoneNumber: 'FISC123',
        requiresUserSelection: false,
      });
    });

    it('handles mix of all sources with no favorites', () => {
      const phoneNumbers: SurveyUnitPhoneNumber[] = [
        { id: '1', source: 'DIRECTORY', favorite: false, number: 'DIR1' },
        { id: '2', source: 'DIRECTORY', favorite: false, number: 'DIR2' },
        { id: '3', source: 'FISCAL', favorite: false, number: 'FISC1' },
        { id: '4', source: 'FISCAL', favorite: false, number: 'FISC2' },
        { id: '5', source: 'INTERVIEWER', favorite: false, number: 'INT1' },
      ];

      const result = selectPhoneNumber(phoneNumbers);
      expect(result).toEqual({
        phoneNumber: 'INT1',
        requiresUserSelection: false,
      });
    });
  });
});
