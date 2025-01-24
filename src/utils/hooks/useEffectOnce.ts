import { useEffect, useRef } from 'react';

export function useEffectOnce(cb: VoidFunction, deps: unknown[]) {
  const ref = useRef<unknown[]>();
  useEffect(() => {
    if (ref.current === deps) {
      return;
    }
    ref.current = deps;
    return cb();
  }, deps);
}
