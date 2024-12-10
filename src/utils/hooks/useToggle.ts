import { useState } from 'react';

/**
 * Toggle a boolean between true / false
 */
export const useToggle = (initial: boolean): [boolean, () => void] => {
  const [state, setState] = useState(initial);
  return [state, () => setState(v => !v)];
};
