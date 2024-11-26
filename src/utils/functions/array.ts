/**
 * Add or Remove an element from an array
 * @template any
 * @param {any[]} arr
 * @param {any} item
 * @return any[]
 */
export function toggleItem(arr: any[], item: any) {
  if (arr.includes(item)) {
    return arr.filter(v => v !== item);
  }
  return [...arr, item];
}

/**
 * Group an array into a record indexed by the key
 * @template any
 * @param {string[]} items
 * @param {(item: any) => string} cb
 * @returns {Record<string, any[]>}
 */
export function groupBy(items: any[], cb: (item: any) => string) {
  return items.reduce((acc, item) => {
    const key = cb(item);
    acc[key] = acc[key] ? [...acc[key], item] : [item];
    return acc;
  }, {});
}
