import { describe, it, expect } from 'vitest';
import { toggleItem, groupBy } from './array';

describe('toggleItem', () => {
  it('should add an item to the array if it does not exist', () => {
    const arr = [1, 2, 3];
    const result = toggleItem(arr, 4);
    expect(result).toEqual([1, 2, 3, 4]);
  });

  it('should remove an item from the array if it exists', () => {
    const arr = [1, 2, 3];
    const result = toggleItem(arr, 2);
    expect(result).toEqual([1, 3]);
  });

  it('should not mutate the original array', () => {
    const arr = [1, 2, 3];
    toggleItem(arr, 4);
    expect(arr).toEqual([1, 2, 3]);
  });

  it('should handle an empty array correctly', () => {
    const arr: any[] = [];
    const result = toggleItem(arr, 'a');
    expect(result).toEqual(['a']);
  });
});

describe('groupBy', () => {
  it('should group items by the callback key', () => {
    const items = [
      { id: 1, category: 'fruit' },
      { id: 2, category: 'vegetable' },
      { id: 3, category: 'fruit' },
    ];
    const result = groupBy(items, item => item.category);
    expect(result).toEqual({
      fruit: [
        { id: 1, category: 'fruit' },
        { id: 3, category: 'fruit' },
      ],
      vegetable: [{ id: 2, category: 'vegetable' }],
    });
  });

  it('should handle an empty array correctly', () => {
    const items: any[] = [];
    const result = groupBy(items, item => item.category);
    expect(result).toEqual({});
  });

  it('should group by unique keys', () => {
    const items = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Alice' },
    ];
    const result = groupBy(items, item => item.name);
    expect(result).toEqual({
      Alice: [
        { id: 1, name: 'Alice' },
        { id: 3, name: 'Alice' },
      ],
      Bob: [{ id: 2, name: 'Bob' }],
    });
  });

  it('should not mutate the original array', () => {
    const items = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ];
    groupBy(items, item => item.name);
    expect(items).toEqual([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ]);
  });
});
