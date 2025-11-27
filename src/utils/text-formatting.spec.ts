import { describe, it, expect } from 'vitest';
import { displayValue, displayBoolean } from './text-formatting';

describe('displayValue', () => {
  it.each([
    [undefined, '-', '-'],
    ['', '-', ''],
    [0, '-', 0],
    ['test', '-', 'test'],
    [undefined, 'N/A', 'N/A'],
  ])('should return "%s" with fallback "%s" as "%s"', (value, fallback, expected) => {
    const result = displayValue(value, fallback);
    expect(result).toBe(expected);
  });
});

describe('displayBoolean', () => {
  it.each([
    [true, 'Yes', 'No', '-', 'Yes'],
    [false, 'Yes', 'No', '-', 'No'],
    [undefined, 'Yes', 'No', '-', '-'],
    [true, 'Oui', 'Non', 'N/A', 'Oui'],
    [false, 'Oui', 'Non', 'N/A', 'Non'],
    [undefined, 'Oui', 'Non', 'N/A', 'N/A'],
  ])(
    'should return "%s" with trueLabel "%s", falseLabel "%s", fallback "%s" as "%s"',
    (value, trueLabel, falseLabel, fallback, expected) => {
      const result = displayBoolean(value, trueLabel, falseLabel, fallback);
      expect(result).toBe(expected);
    }
  );
});
