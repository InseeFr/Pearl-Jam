import { signal } from '@maverick-js/signals';
import { useSignalValue } from './useSignalValue';
import { toggleItem } from '../functions/array';

const emptyFilter = {
  campaigns: [],
  statuses: [],
  priority: false,
  terminated: false,
};

const $filter = signal(emptyFilter);

export function useSearchFilter() {
  /**
   * Toggle a value for a specific filter key
   *
   * @param {"campaigns" | "priority" | "terminated" | "statuses"} key
   * @param {string} [value]
   */
  const toggle = (key, value) => {
    const filter = $filter();

    // Boolean filter
    if (['priority', 'terminated'].includes(key)) {
      return $filter.set({
        ...filter,
        [key]: !filter[key],
      });
    }

    // Array filters
    return $filter.set({
      ...filter,
      [key]: toggleItem(filter[key], value),
    });
  };

  return {
    ...useSignalValue($filter),
    toggle,
  };
}
