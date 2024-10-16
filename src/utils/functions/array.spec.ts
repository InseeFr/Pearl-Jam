import { toggleItem, groupBy } from './array';
import { describe, it, expect } from 'vitest';

describe('toggleItem', () => {
  it('should add an item if it is not in the array', () => {
    const result = toggleItem([1, 2, 3], 4);
    expect(result).toEqual([1, 2, 3, 4]);
  });

  it('should remove an item if it is in the array', () => {
    const result = toggleItem([1, 2, 3], 2);
    expect(result).toEqual([1, 3]);
  });

  it('should add the item if the item is not found', () => {
    const result = toggleItem([1, 2, 3], 5);
    expect(result).toEqual([1, 2, 3, 5]);
  });
});

describe('groupBy', () => {
  it('should group items by the specified key', () => {
    const items = [
      { id: 1, category: 'A' },
      { id: 2, category: 'B' },
      { id: 3, category: 'A' },
    ];
    const result = groupBy(items, item => item.category);
    expect(result).toEqual({
      A: [
        { id: 1, category: 'A' },
        { id: 3, category: 'A' },
      ],
      B: [{ id: 2, category: 'B' }],
    });
  });

  it('should return an empty object for an empty array', () => {
    const result = groupBy([] as { category: string }[], item => item.category);
    expect(result).toEqual({});
  });
});
