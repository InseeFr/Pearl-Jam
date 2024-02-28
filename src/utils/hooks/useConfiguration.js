import { signal } from '@maverick-js/signals';
import { useSignalValue } from './useSignalValue';

/**
 * @type {WriteSignal<{
 *   QUEEN_URL: string
 *   PEARL_API_URL: string
 *   PEARL_AUTHENTICATION_MODE: string
 * } | null>}
 */
const $configuration = signal(null);

export const loadConfiguration = () => {
  fetch(`${window.location.origin}/configuration.json`)
    .then(r => r.json())
    .then(config => $configuration.set(config));
};

/**
 * Get the configuration
 *
 * @return {{
 *   QUEEN_URL: string
 *   PEARL_API_URL: string
 *   PEARL_AUTHENTICATION_MODE: string
 * } | null}
 */
export const useConfiguration = () => {
  return useSignalValue($configuration);
};
