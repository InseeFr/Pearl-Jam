import { useCallback, useState } from 'react';

export function useIncrement({ min, max }: { min: number; max: number }, initial = 0) {
  const [value, setValue] = useState(initial);
  return {
    value,
    increment: useCallback(() => setValue(v => Math.min(max ?? Infinity, v + 1)), [max]),
    decrement: useCallback(() => setValue(v => Math.max(min ?? -Infinity, v - 1)), [min]),
  };
}
