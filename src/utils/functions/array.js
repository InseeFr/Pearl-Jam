/**
 * Add or Remove an element from an array
 * @template T
 * @param {T[]} arr
 * @param {T} item
 * @return T[]
 */
export function toggleItem(arr, item) {
  if (arr.includes(item)) {
    return arr.filter(v => v !== item);
  }
  return [...arr, item];
}

/**
 * Group an array into a record indexed by the ky
 */
export function groupBy(items, cb) {
  return items.reduce((acc, item) => {
    const key = cb(item);
    acc[key] = acc[key] ? [...acc[key], item] : [item];
    return acc;
  }, {});
}
