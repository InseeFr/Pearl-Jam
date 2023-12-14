import { useEffect, useState } from 'react';
import { effect, signal } from '@maverick-js/signals';
import { useEffectOnce } from './useEffectOnce';
import { useSignalValue } from './useSignalValue';

/**
 * @type {WriteSignal<{
 *   QUEEN_URL: string
 *   PEARL_API_URL: string
 *   PEARL_AUTHENTICATION_MODE: string
 *   CHAT_URL: string
 * } | null>}
 */
const $configuration = signal(null);

export const loadConfiguration = () => {
  fetch(`${window.location.origin}/configuration.json`)
    .then(r => r.json())
    .then(config => $configuration.set(config));
};

/**
 * Load the configuration.json file content
 *
 * @template T
 * @return {{
 *   QUEEN_URL: string
 *   PEARL_API_URL: string
 *   PEARL_AUTHENTICATION_MODE: string
 *   CHAT_URL: string
 * } | null}
 */
export const useConfiguration = () => {
  return useSignalValue($configuration);
};
