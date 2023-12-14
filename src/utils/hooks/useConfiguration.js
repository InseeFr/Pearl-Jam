import { useEffect, useState } from 'react';
import { effect, signal } from '@maverick-js/signals';
import { useEffectOnce } from './useEffectOnce';

const $configuration = signal(null);

const loadConfiguration = () => {
  fetch(`${window.location.origin}/configuration.json`)
    .then(r => r.json())
    .then(config => $configuration.set(config));
};

/**
 * Load the configuration.json file content
 *
 * @return {{loadConfiguration: () => void, configuration: {
 *   QUEEN_URL: string
 *   PEARL_API_URL: string
 *   PEARL_AUTHENTICATION_MODE: string
 *   CHAT_URL: string
 * }}
 */
export const useConfiguration = () => {
  const [configuration, setConfiguration] = useState($configuration());

  useEffect(() => {
    return effect(() => setConfiguration($configuration()));
  }, []);

  return { configuration, loadConfiguration };
};
