import { describe, expect, it } from 'vitest';
import { formatPhoneNumber } from './formatPhoneNumber'; // Adjust import path if needed

describe('formatPhoneNumber', () => {
  describe('handling falsy and empty inputs', () => {
    it('should return an empty string when parameter is undefined', () => {
      expect(formatPhoneNumber()).toBe('');
    });

    it('should return an empty string when parameter is an empty string', () => {
      expect(formatPhoneNumber('')).toBe('');
    });

    it('should return an empty string when given non-numeric and non-plus characters', () => {
      expect(formatPhoneNumber('abc')).toBe('');
      expect(formatPhoneNumber(' (---) ')).toBe('');
    });
  });

  describe('handling "+" signs', () => {
    it('should return "+" when input cleans down to only a plus sign', () => {
      expect(formatPhoneNumber('+')).toBe('+');
      expect(formatPhoneNumber('++')).toBe('+');
      expect(formatPhoneNumber('+  ')).toBe('+');
    });

    it('should strip plus signs that do not appear at the start of the string', () => {
      expect(formatPhoneNumber('12+34')).toBe('12 34');
      expect(formatPhoneNumber('06+12+34')).toBe('06 12 34');
    });

    it('should keep only the first "+" when multiple plus signs are provided at start', () => {
      expect(formatPhoneNumber('++33612345678')).toBe('+33 61 23 45 67 8');
    });
  });

  describe('formatting standard local phone numbers', () => {
    it('should split digits into groups of two', () => {
      expect(formatPhoneNumber('0612345678')).toBe('06 12 34 56 78');
    });

    it('should handle odd number of digits correctly', () => {
      expect(formatPhoneNumber('12345')).toBe('12 34 5');
    });

    it('should return a single digit unchanged', () => {
      expect(formatPhoneNumber('1')).toBe('1');
    });

    it('should strip special characters (dots, spaces, dashes, parentheses) before formatting', () => {
      expect(formatPhoneNumber('06.12.34.56.78')).toBe('06 12 34 56 78');
      expect(formatPhoneNumber('(06) 12-34-56-78')).toBe('06 12 34 56 78');
    });
  });

  describe('formatting international numbers', () => {
    it('should preserve leading "+" and format international numbers into pairs', () => {
      expect(formatPhoneNumber('+33612345678')).toBe('+33 61 23 45 67 8');
    });

    it('should format short international numbers correctly', () => {
      expect(formatPhoneNumber('+1')).toBe('+1');
      expect(formatPhoneNumber('+123')).toBe('+12 3');
    });

    it('should correctly format international numbers containing formatting symbols', () => {
      expect(formatPhoneNumber('+33 (0)6 12 34 56 78')).toBe('+33 06 12 34 56 78');
    });
  });
});