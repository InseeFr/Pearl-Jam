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
