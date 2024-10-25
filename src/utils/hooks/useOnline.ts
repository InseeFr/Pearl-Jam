import { useEffect, useState } from 'react';
import { addListener } from '../functions/dom';

/**
 * Detect if the network is online or offline
 */
export function useNetworkOnline() {
  const [isOnline, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const clear: Array<() => void> = [];
    clear.push(addListener(window, 'online', () => setOnline(true)));
    clear.push(addListener(window, 'offline', () => setOnline(false)));
    return () => {
      clear.map(c => c());
    };
  }, []);

  return isOnline;
}
