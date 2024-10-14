import { CONTACT_RELATED_STATES, CONTACT_SUCCESS_LIST, TITLES } from 'utils/constants';
import {
  IASCO_CATEGORY_FINISHING_VALUES,
  IASCO_IDENTIFICATION_FINISHING_VALUES,
  IASCO_SITUATION_FINISHING_VALUES,
  identificationIsFinished,
} from './identificationFunctions';
import { differenceInYears } from 'date-fns';

import D from 'i18n';
import { contactOutcomeEnum } from 'utils/enum/ContactOutcomeEnum';
import { convertSUStateInToDo } from 'utils/functions/convertSUStateInToDo';
import { identificationConfigurationEnum } from 'utils/enum/IdentificationConfigurationEnum';
import surveyUnitIdbService from 'utils/indexeddb/services/surveyUnit-idb-service';
import { surveyUnitStateEnum } from 'utils/enum/SUStateEnum';
import { toDoEnum } from '../enum/SUToDoEnum';
import { normalize } from './string';

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
 * @deprecated shouldn't be used outside of surveyUnitFunctions, use getSuTodoState() instead
 * @param {{ status: string, date: number, id?: string }[]} states
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

const checkValidityForTransmissionNoident = su => {
  const { contactAttempts, contactOutcome, states = [] } = su;
  if (contactAttempts.length === 0) return false;
  if (!contactOutcome) return false;
  const { type, totalNumberOfContactAttempts } = contactOutcome;
  if (totalNumberOfContactAttempts === 0) return false;
  if (type !== contactOutcomeEnum.INTERVIEW_ACCEPTED.type) return true;
  if (getLastState(states)?.type === surveyUnitStateEnum.WAITING_FOR_TRANSMISSION.type) return true;
  return false;
};

const checkValidityForTransmissionIasco = su => {
  const { contactOutcome, identification, identificationConfiguration, states = [] } = su;

  if (!identificationIsFinished(identificationConfiguration, identification)) return false;
  if (!contactOutcome) return false;

  const { type } = contactOutcome;
  // INA contactOutcome + no questionnaire

  if (
    type === contactOutcomeEnum.INTERVIEW_ACCEPTED.type &&
    !getLastState(states)?.type === surveyUnitStateEnum.WAITING_FOR_TRANSMISSION.type
  )
    return false;

  // issue NOA + identification.avi
  const { identification: identificationValue, category, situation } = identification;
  if (
    type === contactOutcomeEnum.NOT_APPLICABLE.type &&
    !IASCO_IDENTIFICATION_FINISHING_VALUES.includes(identificationValue) &&
    !IASCO_SITUATION_FINISHING_VALUES.includes(situation) &&
    !IASCO_CATEGORY_FINISHING_VALUES.includes(category)
  )
    return false;

  // TO finish There
  return getLastState(states)?.type === surveyUnitStateEnum.WAITING_FOR_TRANSMISSION.type;
};

export const isValidForTransmission = su => {
  const { identificationConfiguration } = su;
  switch (identificationConfiguration) {
    case identificationConfigurationEnum.IASCO:
      return checkValidityForTransmissionIasco(su);
    case identificationConfigurationEnum.NOIDENT:
    default:
      return checkValidityForTransmissionNoident(su);
  }
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

export const deleteContactAttempt = (surveyUnit, contactAttempt) => {
  const { contactAttempts } = surveyUnit;
  const newCA = contactAttempts.filter(ca => !areCaEqual(ca, contactAttempt));
  persistSurveyUnit({ ...surveyUnit, contactAttempts: newCA });
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
 * @returns {Array.<{ type: string, value: string }>}
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

/**
 * @deprecated used in the legacy code
 * @template T
 * @param {T[]} surveyUnits
 * @param {{search: string, campaigns: string[], toDos: number[], priority: boolean, terminated: boolean, subSample: number}} filters
 * @return {{matchingEchoes: *, totalEchoes: *, searchFilteredSU: *}}
 */
export const applyFilters = (surveyUnits, filters) => {
  const {
    search: searchFilter,
    campaigns: campaignFilter,
    toDos: toDoFilter,
    priority: priorityFilter,
    terminated: terminatedFilter,
  } = filters;

  const filterBySearch = su => {
    const { firstName, lastName } = getprivilegedPerson(su);
    if (searchFilter !== '') {
      const normalizedSearchFilter = normalize(searchFilter);
      return (
        normalize(firstName).includes(normalizedSearchFilter) ||
        normalize(lastName).includes(normalizedSearchFilter) ||
        su.id.toString().toLowerCase().includes(normalizedSearchFilter) ||
        normalize(su.address.l6.split(' ').slice(1).toString()).includes(normalizedSearchFilter) ||
        convertSUStateInToDo(getLastState(su.states)?.type)
          ?.value.toLowerCase()
          .includes(normalizedSearchFilter) ||
        normalize(su.campaign).includes(normalizedSearchFilter)
      );
    }

    return true;
  };

  const filterByCampaign = su => {
    if (campaignFilter.length > 0) {
      return campaignFilter.includes(su.campaign.toString());
    }

    return true;
  };

  const filterByToDo = su => {
    if (toDoFilter.length > 0) {
      return toDoFilter.includes(
        convertSUStateInToDo(getLastState(su.states)?.type)?.order?.toString?.()
      );
    }
    return true;
  };

  const filterByPriority = su => {
    if (priorityFilter === true) {
      return su.priority;
    }
    return true;
  };

  const filterByTerminated = su => {
    return (
      !terminatedFilter ||
      convertSUStateInToDo(getLastState(su.states)?.type) !== toDoEnum.TERMINATED
    );
  };

  const filteredSU = surveyUnits
    .filter(unit => filterByPriority(unit))
    .filter(unit => filterByToDo(unit))
    .filter(unit => filterByCampaign(unit))
    .filter(unit => filterByTerminated(unit));

  const totalEchoes = surveyUnits.length;
  const searchFilteredSU = filteredSU.filter(unit => filterBySearch(unit));
  const matchingEchoes = searchFilteredSU.length;

  return { searchFilteredSU, totalEchoes, matchingEchoes };
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

export const getIdentificationData = surveyUnit => {
  const { identification, move } = surveyUnit;
  if (!identification) {
    return [
      { label: 'identification', value: '' },
      { label: 'access', value: '' },
      { label: 'situation', value: '' },
      { label: 'category', value: '' },
      { label: 'occupant', value: '' },
      { label: 'move', value: move || false },
    ];
  }
  return [
    { label: 'identification', value: identification.identification || '' },
    { label: 'access', value: identification.access || '' },
    { label: 'situation', value: identification.situation || '' },
    { label: 'category', value: identification.category || '' },
    { label: 'occupant', value: identification.occupant || '' },
    { label: 'move', value: surveyUnit.move || false },
  ];
};

export const getAge = birthdate => {
  if (birthdate === '' || !birthdate) return undefined;
  return differenceInYears(new Date(), new Date(birthdate));
};

export const isTitleMister = title => title.toUpperCase() === TITLES.MISTER.type;

export const displayAgeInYears = birthdate => `${getAge(birthdate) ?? '/'} ${D.years}`;

export const getPhoneData = person => person.phoneNumbers;

export const sortPhoneNumbers = phoneNumbers => {
  let fiscalPhoneNumbers = [];
  let directoryPhoneNumbers = [];
  let interviewerPhoneNumbers = [];

  phoneNumbers.forEach(num => {
    const copiedNum = JSON.parse(JSON.stringify(num));
    switch (num.source.toLowerCase()) {
      case 'fiscal':
        fiscalPhoneNumbers = [...fiscalPhoneNumbers, copiedNum];
        break;
      case 'directory':
        directoryPhoneNumbers = [...directoryPhoneNumbers, copiedNum];
        break;
      case 'interviewer':
        interviewerPhoneNumbers = [...interviewerPhoneNumbers, copiedNum];
        break;

      default:
        break;
    }
  });
  return { fiscalPhoneNumbers, directoryPhoneNumbers, interviewerPhoneNumbers };
};

export const getMailData = person => [
  { label: D.surveyUnitEmail, value: person.email, favorite: person.favoriteEmail },
];

export const getTitle = title => (isTitleMister(title) ? TITLES.MISTER.value : TITLES.MISS.value);
export const getToggledTitle = title =>
  isTitleMister(title) ? TITLES.MISS.type : TITLES.MISTER.type;

export const getPhoneSource = type => {
  switch (type.toLowerCase()) {
    case 'fiscal':
      return D.fiscalSource;
    case 'directory':
      return D.directorySource;
    case 'interviewer':
      return D.interviewerSource;
    default:
      return '';
  }
};

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

export const createStateIds = async latestSurveyUnit => {
  const { id, states } = latestSurveyUnit;
  const previousSurveyUnit = await surveyUnitIdbService.getById(id);
  persistSurveyUnit({ ...previousSurveyUnit, states });
};

export const createCommunicationRequestIds = async latestSurveyUnit => {
  const { id, communicationRequests } = latestSurveyUnit;
  const previousSurveyUnit = await surveyUnitIdbService.getById(id);
  persistSurveyUnit({ ...previousSurveyUnit, communicationRequests });
};

export const toggleFavoritePhoneNumber = (surveyUnit, personId, phoneNumber) => {
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

export const toggleFavoriteEmail = (surveyUnit, personId) => {
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

export const persistSurveyUnit = surveyUnit => surveyUnitIdbService.addOrUpdateSU(surveyUnit);
