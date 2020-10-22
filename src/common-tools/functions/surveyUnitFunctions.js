import surveyUnitDBService from 'indexedbb/services/surveyUnit-idb-service';
import contactAttemptDBService from 'indexedbb/services/contactAttempt-idb-service';
import { convertSUStateInToDo } from 'common-tools/functions/convertSUStateInToDo';

export const getCommentByType = (type, ue) => {
  if (Array.isArray(ue.comments) && ue.comments.length > 0) {
    return ue.comments.find(x => x.type === type).value;
  }
  return '';
};

export const getLastState = ue => {
  if (Array.isArray(ue.states) && ue.states.length > 0) {
    return ue.states.reduce((a, b) => (a.date > b.date ? a : b));
  }
  return false;
};

export const isValidForTransmission = ue => {
  //const { contactOutcome } = ue;

  return true;
};

export const deleteContactAttempt = (surveyUnit, contactAttemptId) => {
  const newSu = surveyUnit;
  const { contactAttempts } = newSu;
  const newCA = contactAttempts.filter(ca => ca !== contactAttemptId);
  newSu.contactAttempts = newCA;
  surveyUnitDBService.update(newSu);
  contactAttemptDBService.delete(contactAttemptId);
};

export const addNewState = async (surveyUnit, stateType) => {
  const newState = { date: new Date().getTime(), type: stateType };
  const newSu = surveyUnit;
  newSu.states.push(newState);
  newSu.lastState = newState;
  newSu.selected = false;
  await surveyUnitDBService.addOrUpdate(newSu);
};

export const searchFilterByAttribute = (filters, attribute) => {
  const searchedFilters = filters.filter(filter => filter.attribute === attribute);

  if (!Array.isArray(searchedFilters) || searchedFilters.length === 0) return undefined;
  return filters.filter(filter => filter.attribute === attribute)[0];
};

export const applyFilters = (surveyUnits, filters) => {
  console.log('filters to be applied => ', filters);

  if (filters === undefined) {
    return {
      searchFilteredSU: surveyUnits,
      totalEchoes: surveyUnits.length,
      matchingEchoes: surveyUnits.length,
    };
  }

  const searchFilter = searchFilterByAttribute(filters, 'search');
  const campaignFilter = searchFilterByAttribute(filters, 'campaign');
  const sampleFilter = searchFilterByAttribute(filters, 'sample');
  const cityNameFilter = searchFilterByAttribute(filters, 'cityName');
  const toDoFilter = searchFilterByAttribute(filters, 'toDo');
  const priorityFilter = searchFilterByAttribute(filters, 'priority');

  const filterBySearch = su => {
    if (searchFilter.value !== undefined) {
      return (
        su.firstName.toLowerCase().includes(searchFilter.value) ||
        su.lastName.toLowerCase().includes(searchFilter.value) ||
        su.id
          .toString()
          .toLowerCase()
          .includes(searchFilter.value) ||
        su.address.l6
          .split(' ')
          .slice(1)
          .toString()
          .toLowerCase()
          .includes(searchFilter.value) ||
        convertSUStateInToDo(getLastState(su).type)
          .value.toLowerCase()
          .includes(searchFilter.value) ||
        su.campaign.toLowerCase().includes(searchFilter.value)
      );
    }

    return true;
  };

  const filterByCampaign = su => {
    if (campaignFilter.value !== undefined) {
      return su.campaign === campaignFilter.value;
    }

    return true;
  };
  const filterBySample = su => {
    if (sampleFilter.value !== undefined) {
      return su.sampleIdentifiers.ssech.toString() === sampleFilter.value.toString();
    }
    return true;
  };
  const filterByCityName = su => {
    if (cityNameFilter.value !== undefined) {
      return su.address.l6.includes(cityNameFilter.value);
    }
    return true;
  };
  const filterByToDo = su => {
    if (toDoFilter.value !== undefined) {
      console.log(convertSUStateInToDo(getLastState(su)), ' - ', toDoFilter.value);
      return convertSUStateInToDo(getLastState(su)).order === toDoFilter.value.order;
    }
    return true;
  };
  const filterByPriority = su => {
    if (priorityFilter.value !== undefined) {
      return su.priority === priorityFilter.value;
    }
    return true;
  };

  const filteredSU = surveyUnits
    .filter(unit => filterByCampaign(unit))
    .filter(unit => filterBySample(unit))
    .filter(unit => filterByCityName(unit))
    .filter(unit => filterByToDo(unit))
    .filter(unit => filterByPriority(unit));

  const totalEchoes = filteredSU.length;
  const searchFilteredSU = filteredSU.filter(unit => filterBySearch(unit));
  const matchingEchoes = searchFilteredSU.length;

  return { searchFilteredSU, totalEchoes, matchingEchoes };
};
