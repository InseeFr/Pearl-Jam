import { useEffect, useRef } from 'react';

export function useEffectOnce(cb: () => void, deps: unknown[]) {
  const ref = useRef<unknown[]>();
  useEffect(() => {
    if (ref.current === deps) {
      return;
    }
    ref.current = deps;
    return cb();
  }, deps);
}
