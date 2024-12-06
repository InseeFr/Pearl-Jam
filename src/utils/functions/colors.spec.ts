import { describe, expect, it } from 'vitest';
import { generateColorInGradient } from './colors';

describe('generateColorInGradient', () => {
  it('should extract hexa values even if the color starts with a #', () => {
    expect(generateColorInGradient('#000', '#FFF', 1)).toEqual('#ff0f00');
  });

  it('should extract hexa values even if the color does not start with a #', () => {
    expect(generateColorInGradient('000', 'FFF', 1)).toEqual('#ff0f00');
  });
});
