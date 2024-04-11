import { useRef } from 'react';

/**
 * @template T
 * @param {T} value
 * @returns {{current: T}}
 */
export function useRefSync(value) {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}
