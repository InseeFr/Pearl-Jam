import { sortOnColumnCompareFunction } from './sortOnColumn';

describe('sortOnColumnCompareFunction', () => {
  it('should return a compare function that sorts by sampleIdentifiers in ascending order', () => {
    const compareFn = sortOnColumnCompareFunction('sampleIdentifiers', 'ASC');
    const a = { sampleIdentifiers: { ssech: 2 } };
    const b = { sampleIdentifiers: { ssech: 1 } };

    expect(compareFn(a, b)).toBe(1);
  });

  it('should return a compare function that returns 0 for unknown fields', () => {
    const compareFn = sortOnColumnCompareFunction('unknownField', 'ASC');
    const a = {};
    const b = {};

    expect(compareFn(a, b)).toBe(0);
  });
});