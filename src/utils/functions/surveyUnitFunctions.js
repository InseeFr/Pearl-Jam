import { differenceInYears } from 'date-fns';
import { CONTACT_RELATED_STATES, CONTACT_SUCCESS_LIST, TITLES } from 'utils/constants';
import { surveyUnitStateEnum } from 'utils/enum/SUStateEnum';
import { convertSUStateInToDo } from 'utils/functions/convertSUStateInToDo';
import { surveyUnitIDBService } from 'utils/indexeddb/services/surveyUnit-idb-service';
import D from 'i18n';

export const getCommentByType = (type, su) => {
  if (Array.isArray(su.comments) && su.comments.length > 0) {
    return su.comments.find(x => x.type === type)?.value || '';
  }
  return '';
};

/**
 * Extract the survey unit state
 *
 * @param {SurveyUnit} surveyUnit
 * @returns {{ order: string, value: string, color: string }}
 */
export const getSuTodoState = surveyUnit => {
  return convertSUStateInToDo(getLastState(surveyUnit?.states ?? [])?.type);
};

/**
 * @param {SurveyUnitState} states
 * @returns {SurveyUnitState} or undefined if no states
 */
export const getLastState = states => states?.slice?.().sort((a, b) => b.date - a.date)?.[0];

const DAY = 1000 * 24 * 60 * 60;

/**
 * Number of days left before the end of the collection for a surveyUnit
 *
 * @param {SurveyUnit|SurveyUnit[]} su
 */
export const daysLeftForSurveyUnit = su => {
  // For multiple survey units find the min endDate
  if (Array.isArray(su)) {
    return Math.min(...su.map(daysLeftForSurveyUnit));
  }
  return Math.max(
    0,
    Math.ceil((new Date(su.collectionEndDate).getTime() - new Date().getTime()) / DAY)
  );
};

/**
 * Contact attempts sorted by date descending
 *
 * @param {SurveyUnit} surveyUnit
 * @returns {SurveyUnitContactAttempt[]}
 */
export const getSortedContactAttempts = surveyUnit => {
  if (surveyUnit === undefined) return [];
  return [...(surveyUnit?.contactAttempts ?? [])].sort((a, b) => b.date - a.date);
};

export const areCaEqual = (ca, anotherCa) => {
  if (!ca || !anotherCa) return false;
  return ca.date === anotherCa.date && ca.status === anotherCa.status;
};

export const getContactAttemptNumber = surveyUnit =>
  surveyUnit.states.filter(state => state.type === surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type)
    .length;

export const lastContactAttemptIsSuccessfull = surveyUnit => {
  const { contactAttempts } = surveyUnit;
  if (Array.isArray(contactAttempts) && contactAttempts.length === 0) return false;
  let lastContactAttempt;
  if (Array.isArray(contactAttempts) && contactAttempts.length > 1) {
    lastContactAttempt = contactAttempts.reduce((a, b) => (a.date > b.date ? a : b));
  } else {
    [lastContactAttempt] = contactAttempts;
  }
  return CONTACT_SUCCESS_LIST.includes(lastContactAttempt.status);
};

const isContactAttemptOk = surveyUnit => lastContactAttemptIsSuccessfull(surveyUnit);

const addLatestState = (states, newState) => {
  const newStates = states?.slice?.() ?? [];
  const previousLatestState = getLastState(newStates);

  const date = previousLatestState?.date;
  if (date && newState.date <= date) {
    newStates.push({ ...newState, date: date + 1 });
  } else {
    newStates.push(newState);
  }
  return newStates;
};

const copyStatesFromSurveyUnit = surveyUnit => surveyUnit?.states?.slice?.() ?? [];

/**
 * Add a contact-related state and ensures states cohesity
 *  => e.g. could add another state after or before newState
 * @param {*} surveyUnit
 * @param {{String: type, String: value}} newState SUStateEnum entry
 * @returns {Array.<{ type: string, value: string }>} updated states
 */
const addContactState = (surveyUnit, newState) => {
  // shallow copy or new empty array
  let newStates = copyStatesFromSurveyUnit(surveyUnit);
  switch (newState.type) {
    case surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type:
      newStates = addLatestState(newStates, newState);
      if (isContactAttemptOk(surveyUnit)) {
        newStates = addLatestState(newStates, {
          date: new Date().getTime(),
          type: surveyUnitStateEnum.APPOINTMENT_MADE.type,
        });
      }
      break;

    case surveyUnitStateEnum.APPOINTMENT_MADE.type:
      if (getContactAttemptNumber(surveyUnit) === 0) {
        newStates = addLatestState(newStates, {
          date: new Date().getTime(),
          type: surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type,
        });
      }
      newStates = addLatestState(newStates, newState);
      break;
    default:
      break;
  }
  return newStates;
};

/**
 * Add a new state to a surveyUnit, with state cohesion
 *
 * @param {SurveyUnit } surveyUnit
 * @param {String }stateType
 * @returns {SurveyUnitState[]}
 */
export const addNewState = (surveyUnit, stateType) => {
  // init returned states : previous states or empty array
  let newStates = copyStatesFromSurveyUnit(surveyUnit);

  const lastStateType = getLastState(newStates)?.type;
  const newState = { date: new Date().getTime(), type: stateType };
  switch (lastStateType) {
    case surveyUnitStateEnum.QUESTIONNAIRE_STARTED.type:
      if (CONTACT_RELATED_STATES.includes(stateType)) {
        newStates = addContactState(surveyUnit, newState);
        newStates = addLatestState(newStates, { date: new Date().getTime(), type: lastStateType });
      } else {
        newStates = addLatestState(newStates, newState);
      }
      break;

    case surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type:
      if (surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type === stateType) {
        if (isContactAttemptOk(surveyUnit)) {
          newStates = addLatestState(newStates, {
            date: new Date().getTime(),
            type: surveyUnitStateEnum.APPOINTMENT_MADE.type,
          });
        }
        break;
      }
      if (surveyUnitStateEnum.APPOINTMENT_MADE.type === stateType) {
        newStates = addContactState(surveyUnit, newState);
      } else {
        newStates = addLatestState(newStates, newState);
      }
      break;

    case surveyUnitStateEnum.APPOINTMENT_MADE.type:
      if (surveyUnitStateEnum.APPOINTMENT_MADE.type === stateType) {
        break;
      }
      if (surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type === stateType) {
        newStates = addContactState(surveyUnit, newState);
      } else {
        newStates = addLatestState(newStates, newState);
      }
      break;

    case surveyUnitStateEnum.WAITING_FOR_TRANSMISSION.type:
    case surveyUnitStateEnum.WAITING_FOR_SYNCHRONIZATION.type:
    case surveyUnitStateEnum.TO_BE_REVIEWED.type:
    case surveyUnitStateEnum.FINALIZED.type:
      if (CONTACT_RELATED_STATES.includes(stateType)) {
        newStates = addContactState(surveyUnit, newState);
        newStates = addLatestState(newStates, {
          date: new Date().getTime(),
          type: surveyUnitStateEnum.WAITING_FOR_TRANSMISSION.type,
        });
      } else {
        newStates = addLatestState(newStates, newState);
      }
      break;

    case surveyUnitStateEnum.IN_PREPARATION.type:
    case surveyUnitStateEnum.VISIBLE_NOT_CLICKABLE.type:
    case surveyUnitStateEnum.VISIBLE_AND_CLICKABLE.type:
    // if no previousState
    default:
      if (CONTACT_RELATED_STATES.includes(stateType)) {
        newStates = addContactState(surveyUnit, newState);
      } else {
        newStates = addLatestState(newStates, newState);
      }
      break;
  }

  return newStates;
};

/**
 * Check if a surveyUnit meets criteria to update state from
 *  VIN to VIC (lastState is VIN and identificationStartDate has passed)
 * @param {*} surveyUnit
 * @returns {[]} newStates
 */
export const updateStateWithDates = surveyUnit => {
  let newStates = copyStatesFromSurveyUnit(surveyUnit);
  const lastState = getLastState(newStates)?.type;
  const currentDate = new Date().getTime();
  const { identificationPhaseStartDate } = surveyUnit;

  if (
    lastState === surveyUnitStateEnum.VISIBLE_NOT_CLICKABLE.type &&
    currentDate > identificationPhaseStartDate
  ) {
    newStates = addNewState(surveyUnit, surveyUnitStateEnum.VISIBLE_AND_CLICKABLE.type);
  }

  return newStates;
};

export const isQuestionnaireAvailable = su => inaccessible => {
  const { collectionEndDate, collectionStartDate } = su;
  const now = new Date().getTime();

  return !inaccessible && now >= collectionStartDate && now <= collectionEndDate;
};

export const isSelectable = su => {
  const { identificationPhaseStartDate, endDate } = su;
  const endTime = new Date(endDate).getTime();
  const identificationPhaseStartTime = new Date(identificationPhaseStartDate).getTime();
  const instantTime = new Date().getTime();
  return endTime > instantTime && instantTime > identificationPhaseStartTime;
};

/**
 * Extract address info from surveyUni address
 * @param {SurveyUnit["address"]} address
 */
export const getAddressData = address => {
  const [postCode, ...rest] = address.l6.split(' ');

  return {
    deliveryPoint: address.l2,
    additionalAddress: address.l3,
    streetName: address.l4,
    locality: address.l5,
    postCode: postCode,
    cityName: rest.join(' '),
    building: address.building,
    floor: address.floor,
    door: address.door,
    staircase: address.staircase,
    elevator: address.elevator,
    cityPriorityDistrict: address.cityPriorityDistrict,
  };
};

export const getAge = birthdate => {
  if (birthdate === '' || !birthdate) return undefined;
  return differenceInYears(new Date(), new Date(birthdate));
};

const isTitleMister = title => title.toUpperCase() === TITLES.MISTER.type;

export const displayAgeInYears = birthdate => `${getAge(birthdate) ?? '/'} ${D.years}`;

export const getTitle = title => (isTitleMister(title) ? TITLES.MISTER.value : TITLES.MISS.value);

export const personPlaceholder = {
  title: TITLES.MISTER.type,
  firstName: '',
  lastName: '',
  email: '',
  birthdate: '',
  favoriteEmail: false,
  privileged: true,
  phoneNumbers: [],
};

/**
 * Person linked to the survey unit
 *
 * @param {SurveyUnit} surveyUnit
 * @returns {SurveyUnitPerson}
 */
export const getprivilegedPerson = surveyUnit => {
  if (!surveyUnit) return personPlaceholder;
  const { persons = [] } = surveyUnit;
  if (!persons.length || persons.length === 0) return personPlaceholder;

  const privilegedPerson = persons.find(p => p.privileged);
  return privilegedPerson ?? persons[0];
};

export const createStateIdsAndCommunicationRequestIds = async latestSurveyUnit => {
  const { id, states, communicationRequests } = latestSurveyUnit;
  const previousSurveyUnit = await surveyUnitIDBService.getById(id);
  persistSurveyUnit({ ...previousSurveyUnit, states, communicationRequests });
};

const toggleFavoritePhoneNumber = (surveyUnit, personId, phoneNumber) => {
  const { number, source } = phoneNumber;
  const updatedPersons = surveyUnit.persons.map(person => {
    if (person.id !== personId) return person;

    const updatedPhoneNumbers = person.phoneNumbers.map(personPhoneNumber => {
      if (personPhoneNumber.number !== number || personPhoneNumber.source !== source)
        return personPhoneNumber;
      return { ...personPhoneNumber, favorite: !personPhoneNumber.favorite };
    });
    return { ...person, phoneNumbers: updatedPhoneNumbers };
  });
  return { ...surveyUnit, persons: updatedPersons };
};

export const toggleFavoritePhoneNumberAndPersist = (surveyUnit, personId, phoneNumber) => {
  const updatedSurveyUnit = toggleFavoritePhoneNumber(surveyUnit, personId, phoneNumber);
  persistSurveyUnit(updatedSurveyUnit);
};

const toggleFavoriteEmail = (surveyUnit, personId) => {
  const updatedPersons = surveyUnit.persons.map(person => {
    if (person.id !== personId) return person;

    return { ...person, favoriteEmail: !person.favoriteEmail };
  });
  return { ...surveyUnit, persons: updatedPersons };
};
export const toggleFavoriteEmailAndPersist = (surveyUnit, personId) => {
  const updatedSurveyUnit = toggleFavoriteEmail(surveyUnit, personId);
  persistSurveyUnit(updatedSurveyUnit);
};

export const persistSurveyUnit = surveyUnit => surveyUnitIDBService.addOrUpdateSU(surveyUnit);
