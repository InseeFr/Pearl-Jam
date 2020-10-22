import { convertSUStateInToDo } from 'common-tools/functions/convertSUStateInToDo';
import { getLastState, intervalInDays } from 'common-tools/functions/surveyUnitFunctions';

export const sortOnColumnCompareFunction = columnFilter => {
  let compareFunction;

  // eslint-disable-next-line no-unused-vars
  const noSortFunction = (a, b) => {
    return 0;
  };

  const reverse = f => (a, b) => {
    return f(b, a);
  };

  const ssechSortFunction = (a, b) => {
    return a.sampleIdentifiers.ssech - b.sampleIdentifiers.ssech;
  };

  const citySortFunction = (a, b) => {
    return a.address.l6
      .split(' ')
      .slice(1)
      .toString()
      .localeCompare(
        b.address.l6
          .split(' ')
          .slice(1)
          .toString()
      );
  };

  const toDoSortFunction = (a, b) => {
    return (
      convertSUStateInToDo(getLastState(a).type).order -
      convertSUStateInToDo(getLastState(b).type).order
    );
  };

  const prioritySortFunction = (a, b) => {
    return b.priority - a.priority;
  };

  const campaignSortFunction = (a, b) => {
    return a.campaign.localeCompare(b.campaign);
  };

  const remainingDaysSortFunction = (a, b) => {
    return intervalInDays(a) - intervalInDays(b);
  };

  if (columnFilter === undefined) {
    compareFunction = noSortFunction;
  } else {
    const { column, order } = columnFilter;
    switch (column) {
      case 'sampleIdentifiers':
        compareFunction = order === 'ASC' ? ssechSortFunction : reverse(ssechSortFunction);
        break;

      case 'geographicalLocation':
        compareFunction = order === 'ASC' ? citySortFunction : reverse(citySortFunction);
        break;

      case 'toDo':
        compareFunction = order === 'ASC' ? toDoSortFunction : reverse(toDoSortFunction);
        break;

      case 'priority':
        compareFunction = order === 'ASC' ? prioritySortFunction : reverse(prioritySortFunction);
        break;

      case 'campaign':
        compareFunction = order === 'ASC' ? campaignSortFunction : reverse(campaignSortFunction);
        break;

      case 'remainingDays':
        compareFunction =
          order === 'ASC' ? remainingDaysSortFunction : reverse(remainingDaysSortFunction);
        break;

      default:
        break;
    }
  }
  return compareFunction;
};
