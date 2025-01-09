import { useCallback, useSyncExternalStore } from 'react';
import { effect, WriteSignal, ReadSignal } from '@maverick-js/signals';

/**
 * Transform a signal into a value used by React
 */
export function useSignalValue<T>(signal: WriteSignal<T> | ReadSignal<T>) {
  const subscribe = useCallback(
    (onChange: (value: T) => void) => effect(() => onChange(signal())),
    []
  );

  return useSyncExternalStore(subscribe, signal, signal);
}
