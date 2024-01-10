import { useCallback, useSyncExternalStore } from 'react';
import { effect } from '@maverick-js/signals';

/**
 * Transform a signal into a value used by React
 * @template T
 * @param {() => T} signal
 * @return {T}
 */
export function useSignalValue(signal) {
  const subscribe = useCallback(onChange => effect(() => onChange(signal())), []);

  return useSyncExternalStore(subscribe, signal, signal);
}
