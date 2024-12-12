import { signal } from '@maverick-js/signals';
import { useSignalValue } from './useSignalValue';
import { CONFIGURATION_FALLBACK } from '../constants';

const $configuration = signal<{
  QUEEN_URL: string;
  PEARL_API_URL: string;
  PEARL_AUTHENTICATION_MODE: string;
} | null>(null);

export const loadConfiguration = () => {
  fetch(`${window.location.origin}/configuration.json`)
    .then(r => r.json())
    .then(config => {
      // store a copy of configuration in the localstorage for SW fallback
      window.localStorage.setItem(CONFIGURATION_FALLBACK, JSON.stringify(config));
      $configuration.set(config);
    });
};

/**
 * Get the configuration
 */
export const useConfiguration = () => {
  return useSignalValue($configuration);
};
