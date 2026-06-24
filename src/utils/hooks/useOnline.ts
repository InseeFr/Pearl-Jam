import { useEffect, useState } from 'react';
import { addListener } from '../functions/dom';

/**
 * Detect if the network is online or offline
 */
export function useNetworkOnline() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const clear: Array<VoidFunction> = [];
    clear.push(
      addListener(globalThis.window, 'online', () => setIsOnline(true)),
      addListener(globalThis.window, 'offline', () => setIsOnline(false))
    );
    return () => {
      clear.forEach(c => c());
    };
  }, []);

  return isOnline;
}
