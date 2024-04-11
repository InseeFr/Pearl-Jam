import { groupBy } from './array';

test('should group items by the provided callback function', () => {
  const items = [
    { id: 1, category: 'A' },
    { id: 2, category: 'B' },
    { id: 3, category: 'A' },
    { id: 4, category: 'C' },
    { id: 5, category: 'B' },
  ];

  const result = groupBy(items, (item) => item.category);

  expect(result).toEqual({
    A: [
      { id: 1, category: 'A' },
      { id: 3, category: 'A' },
    ],
    B: [
      { id: 2, category: 'B' },
      { id: 5, category: 'B' },
    ],
    C: [
      { id: 4, category: 'C' },
    ],
  });
});

test('should return an empty object when items array is empty', () => {
  const items = [];
  const result = groupBy(items, (item) => item.category);
  expect(result).toEqual({});
});

test('should group items by a different property', () => {
  const items = [
    { id: 1, type: 'A' },
    { id: 2, type: 'B' },
    { id: 3, type: 'A' },
    { id: 4, type: 'C' },
    { id: 5, type: 'B' },
  ];

  const result = groupBy(items, (item) => item.type);

  expect(result).toEqual({
    A: [
      { id: 1, type: 'A' },
      { id: 3, type: 'A' },
    ],
    B: [
      { id: 2, type: 'B' },
      { id: 5, type: 'B' },
    ],
    C: [
      { id: 4, type: 'C' },
    ],
  });
});