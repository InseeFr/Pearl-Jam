import { useEffect, useState } from 'react';
import { effect } from '@maverick-js/signals';

/**
 * Transform a signal into a value used by React
 * @template T
 * @param {() => T} signal
 * @return {T}
 */
export function useSignalValue(signal) {
  const [state, setState] = useState(() => signal());

  useEffect(() => {
    return effect(() => setState(signal()));
  }, []);

  return state;
}
