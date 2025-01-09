import { describe, it, expect } from 'vitest';
import { formatDate } from './date';

describe('formatDate', () => {
  it('should return an empty string if no time is provided', () => {
    const result = formatDate(undefined as any);
    expect(result).toBe('');
  });

  it('should format the date without time if withTime is false or undefined', () => {
    const mockTime = new Date('2023-01-01T12:00:00Z').getTime();
    const result = formatDate(mockTime);
    const expectedDate = new Intl.DateTimeFormat(undefined, {
      dateStyle: 'full',
    }).format(new Date(mockTime));
    expect(result).toBe(expectedDate);
  });

  it('should format the date with time if withTime is true', () => {
    const mockTime = new Date('2023-01-01T12:00:00Z').getTime();
    const result = formatDate(mockTime, true);
    const expectedDate = new Intl.DateTimeFormat(undefined, {
      dateStyle: 'full',
      timeStyle: 'short',
    }).format(new Date(mockTime));
    expect(result).toBe(expectedDate);
  });

  it('should handle invalid dates gracefully', () => {
    const invalidTime = NaN;
    const result = formatDate(invalidTime);
    expect(result).toBe('');
  });
});
