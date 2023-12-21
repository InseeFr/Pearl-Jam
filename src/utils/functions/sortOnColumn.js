import { daysLeftForSurveyUnit } from 'utils/functions/surveyUnitFunctions';

/**
 * Generate a comparison function based on a field / direction
 *
 * @template T
 * @param {'sampleIdentifiers' | 'priority' | 'campaign' | 'remainingDays'} field
 * @param {'ASC' | 'DESC'} direction
 * @return (a: T, b: T) => number
 */
export const sortOnColumnCompareFunction = (field, direction) => {
  if (direction === 'DESC') {
    const compareFn = sortOnColumnCompareFunction(field, 'ASC');
    return (a, b) => compareFn(b, a);
  }
  switch (field) {
    case 'sampleIdentifiers':
      return (a, b) => a.sampleIdentifiers.ssech - b.sampleIdentifiers.ssech;

    case 'priority':
      return (a, b) => b.priority - a.priority;

    case 'campaign':
      return (a, b) => a.campaign.localeCompare(b.campaign);

    case 'remainingDays':
      return (a, b) => daysLeftForSurveyUnit(a) - daysLeftForSurveyUnit(b);

    default:
      return (a, b) => 0;
  }
};
