import { useEffect, useRef } from 'react';

export function useEffectOnce(cb, deps) {
  const ref = useRef();
  useEffect(() => {
    if (ref.current === deps) {
      return;
    }
    ref.current = deps;
    return cb();
  }, deps);
}
