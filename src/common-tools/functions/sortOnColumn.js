import { intervalInDays } from 'common-tools/functions/surveyUnitFunctions';

export const sortOnColumnCompareFunction = criteria => {
  let compareFunction;

  // eslint-disable-next-line no-unused-vars
  const noSortFunction = (a, b) => 0;

  const ssechSortFunction = (a, b) => a.sampleIdentifiers.ssech - b.sampleIdentifiers.ssech;

  const prioritySortFunction = (a, b) => b.priority - a.priority;

  const campaignSortFunction = (a, b) => a.campaign.localeCompare(b.campaign);

  const remainingDaysSortFunction = (a, b) => intervalInDays(a) - intervalInDays(b);

  switch (criteria) {
    case 'sampleIdentifiers':
      compareFunction = ssechSortFunction;
      break;

    case 'priority':
      compareFunction = prioritySortFunction;
      break;

    case 'campaign':
      compareFunction = campaignSortFunction;
      break;

    case 'remainingDays':
      compareFunction = remainingDaysSortFunction;
      break;

    default:
      compareFunction = noSortFunction;
      break;
  }
  return compareFunction;
};
