import { effect, signal } from '@maverick-js/signals';
import { SurveyUnit } from 'types/pearl';
import { toDoEnum } from '../enum/SUToDoEnum';
import { daysLeftForSurveyUnit, getprivilegedPerson, getSuTodoState } from '../functions';
import { toggleItem } from '../functions/array';
import { normalize } from '../functions/string';
import { useSignalValue } from './useSignalValue';

type SearchCriteria = {
  sortField:
    | keyof Pick<SurveyUnit, 'sampleIdentifiers' | 'priority' | 'campaign'>
    | 'remainingDays';
  sortDirection: 'ASC' | 'DESC';
  search?: string;
  campaigns: string[];
  states: string[];
  priority: boolean;
  subSample: number;
  subGrappe: string;
  terminated: boolean;
};

type SearchFilterValue = {
  toggle: (key: string, value?: string) => void;
  setSortField: (s: string) => void;
  setSubSample: (s: number | null) => void;
  setSubGrappe: (s: number | null) => void;
  setSearch: (s: string) => void;
  toggleSortDirection: () => void;
  reset: () => void;
} & SearchCriteria;

const storageKey = 'pearl-search-filter';

const emptyFilter = {
  campaigns: [],
  states: [],
  search: '',
  priority: false,
  terminated: true,
  subSample: '',
  subGrappe: '',
  sortField: 'remainingDays',
  sortDirection: 'ASC',
};

const storedFilter = localStorage.getItem(storageKey);
const $filter = signal(storedFilter ? JSON.parse(storedFilter) : emptyFilter);

// Persist filter state in the localStorage
effect(() => {
  const filter = $filter();
  if (filter !== emptyFilter) {
    localStorage.setItem(storageKey, JSON.stringify($filter()));
  }
});

export const useSearchFilter = (): SearchFilterValue => {
  /**
   * Toggle a value for a specific filter key
   */
  const toggle = (key: 'campaigns' | 'priority' | 'terminated' | 'statuses', value: string) => {
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
    setSubSample: subSample => $filter.set({ ...$filter(), subSample: subSample }),
    setSubGrappe: subGrappe => $filter.set({ ...$filter(), subGrappe: subGrappe }),
    setSearch: q => $filter.set({ ...$filter(), search: q }),
    toggleSortDirection: () =>
      $filter.set({
        ...$filter(),
        sortDirection: $filter().sortDirection === 'ASC' ? 'DESC' : 'ASC',
      }),
    reset: () => $filter.set(emptyFilter),
  };
};

export function filterSurveyUnits(surveyUnits: SurveyUnit[], criteria: SearchCriteria) {
  const sortFn = (a: SurveyUnit, b: SurveyUnit): number => {
    if (criteria.sortDirection === 'DESC') {
      const c = a;
      a = b;
      b = c;
    }

    switch (criteria.sortField) {
      case 'sampleIdentifiers':
        return a.sampleIdentifiers.ssech - b.sampleIdentifiers.ssech;

      case 'priority': {
        if (a.priority === b.priority) {
          return 0;
        }
        return a.priority ? -1 : 1;
      }

      case 'campaign':
        return a.campaign.localeCompare(b.campaign);

      case 'remainingDays':
        return daysLeftForSurveyUnit(a) - daysLeftForSurveyUnit(b);

      default:
        return 0;
    }
  };

  const filterFn = (surveyUnit: SurveyUnit): boolean => {
    const searchNormalized = criteria.search ? normalize(criteria.search) : '';
    const campaignNormalized = normalize(surveyUnit.campaign);
    if (
      criteria.campaigns.length > 0 &&
      !criteria.campaigns.includes(surveyUnit.campaign.toString())
    ) {
      return false;
    }

    if (criteria.states.length > 0 && !criteria.states.includes(getSuTodoState(surveyUnit).order)) {
      return false;
    }

    if (criteria.priority && !surveyUnit.priority) {
      return false;
    }

    if (criteria.subSample && surveyUnit.sampleIdentifiers.ssech !== criteria.subSample) {
      return false;
    }

    if (criteria.subGrappe && surveyUnit.sampleIdentifiers.nograp !== criteria.subGrappe) {
      return false;
    }

    if (criteria.terminated && getSuTodoState(surveyUnit) === toDoEnum.TERMINATED) {
      return false;
    }

    if (criteria.search) {
      const person = getprivilegedPerson(surveyUnit);
      const searchString = normalize(
        `${person.firstName} ${person.lastName} ${surveyUnit.id} ${surveyUnit.address.l6} ${surveyUnit.displayName} ${getSuTodoState(surveyUnit).value}`
      );

      if (
        !searchString.includes(searchNormalized) &&
        !campaignNormalized.includes(searchNormalized)
      )
        return false;
    }

    return true;
  };

  return surveyUnits.filter(filterFn).sort(sortFn);
}
