import { CONTACT_RELATED_STATES, CONTACT_SUCCESS_LIST } from 'common-tools/constants';
import surveyUnitStateEnum from 'common-tools/enum/SUStateEnum';
import { convertSUStateInToDo } from 'common-tools/functions/convertSUStateInToDo';
import { differenceInYears, formatDistanceStrict } from 'date-fns';
import D from 'i18n';
import surveyUnitDBService from 'indexedbb/services/surveyUnit-idb-service';

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
  if (new Date().getTime() > new Date(collectionEndDate).getTime()) return 0;
  const remainingDays = formatDistanceStrict(new Date(), new Date(collectionEndDate), {
    roundingMethod: 'ceil',
    unit: 'day',
    addSuffix: true,
  });

  return remainingDays.split(' ')[0];
};

export const isValidForTransmission = ue =>
  /* const { contactOutcome } = ue;
  return contactOutcome !== null; */
  ue !== undefined;

export const getSortedContactAttempts = surveyUnit => {
  if (surveyUnit === undefined) return [];

  const { contactAttempts } = surveyUnit;

  if (contactAttempts === undefined || contactAttempts.length === 0) return [];

  contactAttempts.sort((a, b) => b.date - a.date);
  return contactAttempts;
};

export const areCaEqual = (ca, anotherCa) => {
  if (!ca || !anotherCa) return false;
  return ca.date === anotherCa.date && ca.status === anotherCa.status;
};

export const deleteContactAttempt = (surveyUnit, contactAttempt) => {
  const { contactAttempts } = surveyUnit;
  const newCA = contactAttempts.filter(ca => !areCaEqual(ca, contactAttempt));
  surveyUnitDBService.update({ ...surveyUnit, contactAttempts: newCA });
};

export const getContactAttemptNumber = surveyUnit =>
  surveyUnit.states.filter(state => state.type === surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type)
    .length;

const lastContactAttemptIsSuccessfull = surveyUnit => {
  const { contactAttempts } = surveyUnit;
  let lastContactAttempt;
  if (Array.isArray(contactAttempts) && contactAttempts.length > 1) {
    lastContactAttempt = contactAttempts.reduce((a, b) => (a.date > b.date ? a : b));
  } else {
    [lastContactAttempt] = contactAttempts;
  }
  return CONTACT_SUCCESS_LIST.includes(lastContactAttempt.status);
};

const isContactAttemptOk = async surveyUnit => lastContactAttemptIsSuccessfull(surveyUnit);

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
      break;
    default:
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
      break;
  }
  newSu.selected = false;
  await surveyUnitDBService.addOrUpdate(newSu);
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

export const isQuestionnaireAvailable = su => {
  const { collectionEndDate, collectionStartDate } = su;
  const now = new Date().getTime();

  return now >= collectionStartDate && now <= collectionEndDate;
};

export const applyFilters = (surveyUnits, filters) => {
  const {
    search: searchFilter,
    campaigns: campaignFilter,
    toDos: toDoFilter,
    priority: priorityFilter,
  } = filters;

  const normalize = string =>
    string
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

  const filterBySearch = su => {
    const { firstName, lastName } = getprivilegedPerson(su);
    if (searchFilter !== '') {
      const normalizedSearchFilter = normalize(searchFilter);
      return (
        normalize(firstName).includes(normalizedSearchFilter) ||
        normalize(lastName).includes(normalizedSearchFilter) ||
        su.id
          .toString()
          .toLowerCase()
          .includes(normalizedSearchFilter) ||
        normalize(
          su.address.l6
            .split(' ')
            .slice(1)
            .toString()
        ).includes(normalizedSearchFilter) ||
        convertSUStateInToDo(getLastState(su).type)
          .value.toLowerCase()
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
      return toDoFilter.includes(convertSUStateInToDo(getLastState(su).type).order.toString());
    }
    return true;
  };
  const filterByPriority = su => {
    if (priorityFilter === true) {
      return su.priority;
    }
    return true;
  };

  const filteredSU = surveyUnits
    .filter(unit => filterByPriority(unit))
    .filter(unit => filterByToDo(unit))
    .filter(unit => filterByCampaign(unit));

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

export const getAddressData = su => {
  const [postCode, cityName] = su.address.l6.split(' ');

  return [
    { label: D.addressDeliveryPoint, value: su.address.l2 || '' },
    { label: D.addressAdditionalAddress, value: su.address.l3 || '' },
    { label: D.addressStreetName, value: su.address.l4 || '' },
    { label: D.addressLocality, value: su.address.l5 || '' },
    { label: D.addressPostcode, value: postCode || '' },
    { label: D.addressCity, value: cityName || '' },
  ];
};

export const getAgeGroup = birthdate => {
  const age = getAge(birthdate);
  if (age <= 25) return D.ageGroupOne;
  if (age <= 35) return D.ageGroupTwo;
  if (age <= 55) return D.ageGroupThree;
  if (age <= 75) return D.ageGroupFour;
  return D.ageGroupFive;
};

export const getAge = birthdate => {
  if (birthdate === '' || !birthdate) return ' ';
  return differenceInYears(new Date(), new Date(birthdate));
};

export const getUserData = person => [
  { label: D.surveyUnitTitle, value: getTitle(person.title) },
  { label: D.surveyUnitLastName, value: person.lastName },
  { label: D.surveyUnitFirstName, value: person.firstName },
  { label: D.surveyUnitAge, value: `${getAge(person.birthdate)} ${D.years}` },
];

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
  { label: undefined, value: person.email, favorite: person.favoriteEmail },
];

export const getTitle = title => {
  switch (title.toLowerCase()) {
    case 'mister':
      return D.titleMister;
    case 'miss':
      return D.titleMiss;
    default:
      return '';
  }
};

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
  title: 'MISTER',
  firstName: '',
  lastName: '',
  email: '',
  birthdate: '',
  favoriteEmail: false,
  privileged: true,
  phoneNumbers: [],
};

export const getprivilegedPerson = surveyUnit => {
  if (!surveyUnit) return personPlaceholder;
  const { persons } = surveyUnit;
  if (!persons || !persons.length || persons.length === 0) return personPlaceholder;

  const privilegedPerson = persons.find(p => p.privileged);
  return privilegedPerson ? privilegedPerson : persons[0];
};
