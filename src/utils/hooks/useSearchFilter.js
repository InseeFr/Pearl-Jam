import { signal } from '@maverick-js/signals';
import { useSignalValue } from './useSignalValue';
import { toggleItem } from '../functions/array';

const emptyFilter = {
  campaigns: [],
  statuses: [],
  search: '',
  priority: false,
  terminated: false,
  sortField: 'remainingDays',
  sortDirection: 'ASC',
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
    setSortField: field => $filter.set({ ...$filter(), sortField: field, sortDirection: 'DESC' }),
    setSearch: q => $filter.set({ ...$filter(), search: q }),
    toggleSortDirection: dir =>
      $filter.set({
        ...$filter(),
        sortDirection: $filter().sortDirection === 'ASC' ? 'DESC' : 'ASC',
      }),
    reset: () => $filter.set(emptyFilter),
  };
}
