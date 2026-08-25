import { SurveyUnit } from 'types/pearl';
import { getLastSubmittedCommunication } from './surveyUnitTrackingCommunication';
import { getprivilegedPerson } from '../surveyUnitFunctions';
import { getSuTodoState } from '../surveyUnitState';

/**
 * Custom comparison function for mail column sorting.
 * Sorts by type first (ascending/descending), then by date (newest first).
 */
export const compareMail = (a: SurveyUnit, b: SurveyUnit, isAscending: boolean): number => {
  const mailA = getLastSubmittedCommunication(a);
  const mailB = getLastSubmittedCommunication(b);

  if (!mailA && !mailB) return 0;
  if (!mailA) return 1;
  if (!mailB) return -1;

  const typeA = mailA.type ?? '';
  const typeB = mailB.type ?? '';
  const typeCompare = typeA.localeCompare(typeB);
  if (typeCompare !== 0) {
    return isAscending ? typeCompare : -typeCompare;
  }

  const dateA = mailA.date ?? 0;
  const dateB = mailB.date ?? 0;
  if (dateA !== dateB) {
    return isAscending ? dateB - dateA : dateA - dateB;
  }

  return 0;
};

export const compareValues = (a: number | string, b: number | string, isAscending: boolean) => {
  if (a < b) return isAscending ? -1 : 1;
  if (a > b) return isAscending ? 1 : -1;
  return 0;
};

export const getLastName = (su: SurveyUnit) => getprivilegedPerson(su).lastName.toUpperCase();
const getOrder = (su: SurveyUnit) => Number.parseInt(getSuTodoState(su)?.order ?? '0', 10);
const contactOutcomeOrder = [
  'INA',
  'REF',
  'IMP',
  'UCD',
  'UTR',
  'DCD',
  'ALA',
  'UCD',
  'DUK',
  'DUU',
  'NUH',
  'NOA',
];
export const getOutcomeIndex = (su: SurveyUnit) => {
  if (su.contactOutcome?.type) {
    const index = contactOutcomeOrder.indexOf(su.contactOutcome.type);
    return index === -1 ? Infinity : index;
  }

  return Infinity;
};

export const sortSurveyUnitsTrackingTable = (
  surveyUnits: SurveyUnit[],
  campaign: string,
  searchText: string,
  sortConfig: { key: string; direction: string }
) => {
  return surveyUnits
    .filter(su => {
      const person = getprivilegedPerson(su);
      const filteredByCampaign = campaign === '' || su.campaign === campaign;
      return (
        filteredByCampaign &&
        (searchText === '' ||
          person.lastName.toUpperCase().includes(searchText.toUpperCase()) ||
          person.firstName.toUpperCase().includes(searchText.toUpperCase()) ||
          su?.displayName?.toUpperCase().includes(searchText.toUpperCase()) ||
          su.id.toUpperCase().includes(searchText.toUpperCase()))
      );
    })
    .sort((a, b) => {
      const isAscending = sortConfig.direction === 'asc';
      let compareA, compareB;
      switch (sortConfig.key) {
        case 'lastName':
          compareA = getLastName(a);
          compareB = getLastName(b);
          break;
        case 'order':
          compareA = getOrder(a);
          compareB = getOrder(b);
          break;
        case 'outcome':
          compareA = getOutcomeIndex(a);
          compareB = getOutcomeIndex(b);
          if (!isAscending) {
            compareA = compareA === Infinity ? -Infinity : compareA;
            compareB = compareB === Infinity ? -Infinity : compareB;
          }
          break;
        case 'mail':
          return compareMail(a, b, isAscending);
        default:
          compareA = a.id;
          compareB = b.id;
      }
      return compareValues(compareA, compareB, isAscending);
    });
};
