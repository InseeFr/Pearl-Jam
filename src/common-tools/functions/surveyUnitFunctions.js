import surveyUnitDBService from 'indexedbb/services/surveyUnit-idb-service';
import contactAttemptDBService from 'indexedbb/services/contactAttempt-idb-service';
<<<<<<< HEAD
import { convertSUStateInToDo } from 'common-tools/functions/convertSUStateInToDo';
=======
>>>>>>> f896174... WIP life-cycle management
import { CONTACT_RELATED_STATES, CONTACT_SUCCESS_LIST } from 'common-tools/constants';
import surveyUnitStateEnum from 'common-tools/enum/SUStateEnum';
import { formatDistanceStrict } from 'date-fns';

export const getCommentByType = (type, ue) => {
  if (Array.isArray(ue.comments) && ue.comments.length > 0) {
    return ue.comments.find(x => x.type === type).value;
  }
  return '';
};

export const getLastState = ue => {
  if (Array.isArray(ue.states) && ue.states.length === 1) return ue.states[0];
  if (Array.isArray(ue.states) && ue.states.length > 1) {
    return ue.states.reduce((a, b) => (a.date > b.date ? a : b));
  }
  return false;
};

export const intervalInDays = su => {
  const { collectionEndDate } = su;

  const remainingDays = formatDistanceStrict(new Date(), new Date(collectionEndDate), {
    roundingMethod: 'ceil',
    unit: 'day',
  });

  return remainingDays.split(' ')[0];
};

export const isValidForTransmission = ue => {
  const { contactOutcome } = ue;
  return contactOutcome !== null;
};

const getContactAttempts = async surveyUnit => {
  const { contactAttempts } = surveyUnit;
  return contactAttemptDBService.findByIds(contactAttempts);
};

export const deleteContactAttempt = (surveyUnit, contactAttemptId) => {
  const newSu = surveyUnit;
  const { contactAttempts } = newSu;
  const newCA = contactAttempts.filter(ca => ca !== contactAttemptId);
  newSu.contactAttempts = newCA;
  surveyUnitDBService.update(newSu);
  contactAttemptDBService.delete(contactAttemptId);
};

const getContactAttemptNumber = surveyUnit => {
  return surveyUnit.states.filter(
    state => state.type === surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type
  ).length;
};

const lastContactAttemptIsSuccessfull = async surveyUnit => {
  const contactAttempts = await getContactAttempts(surveyUnit);
  let lastContactAttempt;
  if (Array.isArray(contactAttempts) && contactAttempts.length > 1) {
    lastContactAttempt = contactAttempts.reduce((a, b) => (a.date > b.date ? a : b));
  } else {
    lastContactAttempt = contactAttempts;
  }
  return CONTACT_SUCCESS_LIST.includes(lastContactAttempt.status);
};

const isContactAttemptOk = async surveyUnit => {
  return lastContactAttemptIsSuccessfull(surveyUnit);
};

const addContactState = async (surveyUnit, newState) => {
  switch (newState.type) {
    case surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type:
      surveyUnit.states.push(newState);
      if (await isContactAttemptOk(surveyUnit)) {
        surveyUnit.states.push({
          date: new Date().getTime(),
          type: surveyUnitStateEnum.APPOINTMENT_MADE.type,
        });
      }
      break;

    case surveyUnitStateEnum.APPOINTMENT_MADE.type:
      if (getContactAttemptNumber(surveyUnit) === 0) {
        surveyUnit.states.push({
          date: newState.date - 1,
          type: surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type,
        });
      }
      surveyUnit.states.push(newState);
<<<<<<< HEAD

=======
>>>>>>> b15f073... fix asynchronous indexedDB calls
      break;
    default:
      console.log('erreur avec le type : ', newState.type);
      break;
  }
  return surveyUnit;
};

export const addNewState = async (surveyUnit, stateType) => {
  const lastStateType = getLastState(surveyUnit).type;
  const newState = { date: new Date().getTime(), type: stateType };
  let newSu = surveyUnit;
  switch (lastStateType) {
    case surveyUnitStateEnum.QUESTIONNAIRE_STARTED.type:
      if (CONTACT_RELATED_STATES.includes(stateType)) {
        newSu = await addContactState(newSu, newState);

        const previousState = { date: new Date().getTime(), type: lastStateType };
        newSu.states.push(previousState);
      } else {
        newSu.states.push(newState);
      }
      break;

    case surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type:
      if (surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type === stateType) {
        if (await isContactAttemptOk(surveyUnit)) {
          surveyUnit.states.push({
            date: new Date().getTime(),
            type: surveyUnitStateEnum.APPOINTMENT_MADE.type,
          });
        }
        break;
      }
      if (surveyUnitStateEnum.APPOINTMENT_MADE.type === stateType) {
        newSu = await addContactState(newSu, newState);
      } else {
        newSu.states.push(newState);
      }
      break;

    case surveyUnitStateEnum.APPOINTMENT_MADE.type:
      if (surveyUnitStateEnum.APPOINTMENT_MADE.type === stateType) {
        break;
      }
      if (surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type === stateType) {
        newSu = await addContactState(newSu, newState);
      } else {
        newSu.states.push(newState);
      }
      break;

    case surveyUnitStateEnum.IN_PREPARATION.type:
    case surveyUnitStateEnum.VISIBLE_NOT_CLICKABLE.type:
    case surveyUnitStateEnum.VISIBLE_AND_CLICKABLE.type:
      if (CONTACT_RELATED_STATES.includes(stateType)) {
        newSu = await addContactState(newSu, newState);
      } else {
        newSu.states.push(newState);
      }
      break;

    case surveyUnitStateEnum.WAITING_FOR_TRANSMISSION.type:
    case surveyUnitStateEnum.WAITING_FOR_SYNCHRONIZATION.type:
    case surveyUnitStateEnum.TO_BE_REVIEWED.type:
    case surveyUnitStateEnum.FINALIZED.type:
    case surveyUnitStateEnum.QUESTIONNAIRE_NOT_AVAILABLE.type:
      // TODO : peut-être d'autres états  gérer ici
      if (CONTACT_RELATED_STATES.includes(stateType)) {
        newSu = await addContactState(newSu, newState);
        newSu.states.push({
          date: new Date().getTime(),
          type: surveyUnitStateEnum.WAITING_FOR_TRANSMISSION.type,
        });
      } else {
        newSu.states.push(newState);
      }
      break;
    default:
      console.log('default case nothing done');
      break;
  }
  newSu.selected = false;
  await surveyUnitDBService.addOrUpdate(newSu);
};

export const searchFilterByAttribute = (filters, attribute) => {
  const searchedFilters = filters.filter(filter => filter.attribute === attribute);

  if (!Array.isArray(searchedFilters) || searchedFilters.length === 0) return undefined;
  return filters.filter(filter => filter.attribute === attribute)[0];
};

export const applyFilters = (surveyUnits, filters) => {
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
      return (
        convertSUStateInToDo(getLastState(su).type).order.toString() === toDoFilter.value.toString()
      );
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
export const checkIfContactAttemptCanBeDeleted = surveyUnit => {
  return getContactAttemptNumber(surveyUnit) > 1;
};

export const updateStateWithDates = surveyUnit => {
  const lastState = getLastState(surveyUnit).type;
  const currentDate = new Date().getTime();
  const { identificationPhaseStartDate } = surveyUnit;
  let result = 0;
  if (
    lastState === surveyUnitStateEnum.VISIBLE_NOT_CLICKABLE.type &&
    currentDate > identificationPhaseStartDate
  ) {
    result = 1;
    addNewState(surveyUnit, surveyUnitStateEnum.VISIBLE_AND_CLICKABLE.type);
  }

  return result;
};
