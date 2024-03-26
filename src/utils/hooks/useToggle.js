import { useCallback, useState } from 'react';

/**
 * Toggle a boolean between true / false
 *
 * @param {boolean} initial
 * @return {[boolean, () => void]}
 */
export function useToggle(initial) {
  const [state, setState] = useState(initial);
  return [state, useCallback(() => setState(v => !v))];
}
