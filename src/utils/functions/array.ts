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
 */
export function groupBy<T extends object>(
  items: T[],
  cb: (item: T) => string
): Record<string, T[]> {
  return items.reduce((acc: Record<string, T[]>, item: T) => {
    const key = cb(item);
    return {
      ...acc,
      [key]: acc[key] ? [...acc[key], item] : [item],
    };
  }, {});
}
