import { useEffect, useState } from 'react';
import { addListener } from '../functions/dom';

/**
 * Detect if the network is online or offline
 */
export function useNetworkOnline() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const clear: Array<VoidFunction> = [];
    clear.push(addListener(window, 'online', () => setIsOnline(true)));
    clear.push(addListener(window, 'offline', () => setIsOnline(false)));
    return () => {
      clear.forEach(c => c());
    };
  }, []);

  return isOnline;
}
