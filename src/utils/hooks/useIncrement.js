import { useCallback, useState } from 'react';

/**
 * Increment a value with min / max
 *
 * @param {number} initial
 * @param {number} min
 * @param {number} max
 * @return {{value: number, increment: () => void, decrement: () => void}}
 */
export function useIncrement(initial = 0, { min, max }) {
  const [value, setValue] = useState(initial);
  return {
    value,
    increment: useCallback(() => setValue(v => Math.min(max ?? Infinity, v + 1)), [max]),
    decrement: useCallback(() => setValue(v => Math.max(min ?? -Infinity, v - 1)), [min]),
  };
}
