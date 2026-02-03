import { differenceInYears } from 'date-fns';
import { CONTACT_SUCCESS_LIST, TITLES } from 'utils/constants';
import { surveyUnitStateEnum } from 'utils/enum/SUStateEnum';
import { surveyUnitIDBService } from 'utils/indexeddb/services/surveyUnit-idb-service';
import D from 'i18n';
import {
  ContactPersonTitle,
  SurveyUnit,
  SurveyUnitContactAttempt,
  SurveyUnitPhoneNumber,
} from 'types/pearl';

export const getCommentByType = (type: string, su: SurveyUnit) => {
  if (Array.isArray(su.comments) && su.comments.length > 0) {
    return su.comments.find(x => x.type === type)?.value || '';
  }
  return '';
};

const DAY = 1000 * 24 * 60 * 60;

/**
 * Number of minimal or maximum days left before the end of the collection for surveyUnits
 *
 * @param {SurveyUnit} su
 */
export const daysLeftForSurveyUnits = (sus: SurveyUnit[], min = true): number => {
  if (!min) return Math.max(...sus.map(daysLeftForSurveyUnit));
  return Math.min(...sus.map(daysLeftForSurveyUnit));
};

/**
 * Number of days left before the end of the collection for a surveyUnit
 *
 * @param {SurveyUnit} su
 */
export const daysLeftForSurveyUnit = (su: SurveyUnit): number => {
  return Math.max(0, Math.ceil((new Date(su.collectionEndDate).getTime() - Date.now()) / DAY));
};

/**
 * Contact attempts sorted by date descending
 *
 * @param {SurveyUnit} surveyUnit
 * @returns {SurveyUnitContactAttempt[]}
 */
export const getSortedContactAttempts = (surveyUnit: SurveyUnit) => {
  if (surveyUnit === undefined) return [];
  return [...(surveyUnit?.contactAttempts ?? [])].sort((a, b) => b.date - a.date);
};

export const areCaEqual = (ca?: SurveyUnitContactAttempt, anotherCa?: SurveyUnitContactAttempt) => {
  if (!ca || !anotherCa) return false;
  return ca.date === anotherCa.date && ca.status === anotherCa.status;
};

export const getContactAttemptNumber = (surveyUnit: SurveyUnit) =>
  surveyUnit.states.filter(state => state.type === surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type)
    .length;

export const lastContactAttemptIsSuccessfull = (surveyUnit: SurveyUnit) => {
  const { contactAttempts } = surveyUnit;
  if (Array.isArray(contactAttempts) && contactAttempts.length === 0) return false;
  let lastContactAttempt;
  if (Array.isArray(contactAttempts) && contactAttempts.length > 1) {
    lastContactAttempt = contactAttempts.reduce(
      (a, b) => (a.date > b.date ? a : b),
      contactAttempts[0]
    );
  } else {
    [lastContactAttempt] = contactAttempts;
  }
  return CONTACT_SUCCESS_LIST.includes(lastContactAttempt.status);
};

export const isContactAttemptOk = (surveyUnit: SurveyUnit) =>
  lastContactAttemptIsSuccessfull(surveyUnit);

export const isQuestionnaireAvailable = (su: SurveyUnit) => (inaccessible: boolean) => {
  const { collectionEndDate, collectionStartDate } = su;
  const now = Date.now();

  return !inaccessible && now >= collectionStartDate && now <= collectionEndDate;
};

export const isSelectable = (su: SurveyUnit) => {
  const { identificationPhaseStartDate, endDate } = su;
  const endTime = new Date(endDate).getTime();
  const identificationPhaseStartTime = new Date(identificationPhaseStartDate).getTime();
  const instantTime = Date.now();
  return endTime > instantTime && instantTime > identificationPhaseStartTime;
};

/**
 * Extract address info from surveyUni address
 * @param {SurveyUnit["address"]} address
 */
export const getAddressData = (address: any) => {
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

export const getAge = (birthdate?: number | string) => {
  if (birthdate === '' || !birthdate) return undefined;
  return differenceInYears(new Date(), new Date(birthdate));
};

const isTitleMister = (title: ContactPersonTitle) => title.toUpperCase() === TITLES.MISTER.type;

export const displayAgeInYears = (birthdate: number) => `${getAge(birthdate) ?? '/'} ${D.years}`;

export const getTitle = (title: ContactPersonTitle) =>
  isTitleMister(title) ? TITLES.MISTER.value : TITLES.MISS.value;

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
export const getprivilegedPerson = (surveyUnit: SurveyUnit) => {
  if (!surveyUnit) return personPlaceholder;
  const { persons = [] } = surveyUnit;
  if (!persons.length || persons.length === 0) return personPlaceholder;

  const privilegedPerson = persons.find(p => p.privileged);
  return privilegedPerson ?? persons[0];
};

export const createStateIdsAndCommunicationRequestIds = async (latestSurveyUnit: SurveyUnit) => {
  const { id, states, communicationRequests } = latestSurveyUnit;
  const previousSurveyUnit = await surveyUnitIDBService.getById(id);
  persistSurveyUnit({ ...previousSurveyUnit, states, communicationRequests });
};

const toggleFavoritePhoneNumber = (
  surveyUnit: SurveyUnit,
  personId: number,
  phoneNumber: SurveyUnitPhoneNumber
) => {
  const { number, source } = phoneNumber;
  const isFavorite = !phoneNumber.favorite;

  const updatedPersons = surveyUnit.persons.map(person => {
    if (person.id !== personId) {
      return person;
    }

    const updatedPhoneNumbers = person.phoneNumbers.map(personPhoneNumber => {
      if (personPhoneNumber.number !== number || personPhoneNumber.source !== source)
        return { ...personPhoneNumber, favorite: false };
      return { ...personPhoneNumber, favorite: isFavorite };
    });
    return { ...person, phoneNumbers: updatedPhoneNumbers };
  });
  return { ...surveyUnit, persons: updatedPersons };
};

export const toggleFavoritePhoneNumberAndPersist = (
  surveyUnit: SurveyUnit,
  personId: number,
  phoneNumber: SurveyUnitPhoneNumber
) => {
  const updatedSurveyUnit = toggleFavoritePhoneNumber(surveyUnit, personId, phoneNumber);
  persistSurveyUnit(updatedSurveyUnit);
};

export const persistSurveyUnit = (surveyUnit: SurveyUnit) =>
  surveyUnitIDBService.addOrUpdateSU(surveyUnit);
