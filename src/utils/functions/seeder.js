import { surveyUnitStateEnum } from '../enum/SUStateEnum';
import { contactOutcomeEnum } from '../enum/ContactOutcomeEnum';
import { surveyUnitIDBService } from '../indexeddb/services/surveyUnit-idb-service';
import userIdbService from '../indexeddb/services/user-idb-service';

const day = 60 * 60 * 1000 * 24;
const year = day * 365;

/**
 * @typedef {Object} User
 * @property {number} id - The user ID.
 * @property {string} name - The user's full name.
 * @property {string} username - The user's username.
 * @property {string} email - The user's email address.
 * @property {{
 *   street: string,
 *   suite: string,
 *   city: string,
 *   zipcode: string,
 *   geo: { lat: string, lng: string }
 * }} address - The user's address information.
 * @property {string} phone - The user's phone number.
 * @property {string} website - The user's website URL.
 * @property {{
 *   name: string,
 *   catchPhrase: string,
 *   bs: string
 * }} company - The user's company information.
 */

export async function seedData() {
  /** @var {SurveyUnit[]} surveyUnits */
  const surverUnits = [];
  /** @var {User[]} users */
  const users = await fetch('https://jsonplaceholder.typicode.com/users').then(r => r.json());
  for (const user of users) {
    let states = [
      {
        id: user.id + 1_000,
        date: new Date().getTime() - 10 * day,
        type: surveyUnitStateEnum.IN_PREPARATION.type,
      },
    ];
    if (user.id > 2) {
      states = [
        ...states,
        {
          id: user.id + 2_000,
          date: new Date().getTime() - 9 * day,
          type: surveyUnitStateEnum.VISIBLE_AND_CLICKABLE.type,
        },
      ];
    }
    if (user.id > 3) {
      states = [
        ...states,
        {
          date: new Date().getTime() - 8 * day,
          type: surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type,
        },
      ];
    }
    if (user.id > 4) {
      states = [
        ...states,
        {
          date: new Date().getTime() - 7 * day,
          type: surveyUnitStateEnum.APPOINTMENT_MADE.type,
        },
      ];
    }
    surverUnits.push({
      id: `su${user.id}`,
      communicationRequestConfiguration: true,
      persons: [
        {
          id: user.id,
          title: getRandomItemFromArray(['MISS', 'MISTER']),
          firstName: user.name.split(' ')[0],
          lastName: user.name.split(' ')[1],
          email: user.email,
          birthdate: new Date(year - getRandomInt(20, 80)).getTime(),
          favoriteEmail: false,
          privileged: true,
          phoneNumbers: [
            {
              source: 'FISCAL',
              favorite: false,
              number: user.phone,
            },
            {
              source: 'DIRECTORY',
              favorite: true,
              number: user.phone + '01',
            },
          ],
        },
      ],
      address: {
        l1: user.name,
        l2: '',
        l3: '',
        l4: user.address.street,
        l5: '',
        l6: `${user.address.zipcode} ${user.address.city}`,
        l7: 'United States',
        elevator: false,
        building: '',
        floor: '',
        door: user.address.suite,
        staircase: '',
        cityPriorityDistrict: false,
      },
      priority: false,
      move: false,
      campaign: 'TestCampaign',
      comments: [
        {
          type: 'MANAGEMENT',
          value: '',
        },
        {
          type: 'INTERVIEWER',
          value: '',
        },
      ],
      sampleIdentifiers: {
        bs: 0,
        ec: '0',
        le: 0,
        noi: 0,
        numfa: 32,
        rges: 15,
        ssech: 1,
        nolog: 0,
        nole: 0,
        autre: '',
        nograp: '',
      },
      states: states,
      contactAttempts: [
        {
          status: contactOutcomeEnum.IMPOSSIBLE_TO_REACH.type,
          date: new Date().getTime() - getRandomInt(10, 100) * day,
          medium: 'FIELD',
        },
        {
          status: contactOutcomeEnum.INTERVIEW_ACCEPTED.type,
          date: new Date().getTime() - getRandomInt(3, 9) * day,
          medium: 'FIELD',
        },
      ],
      identification: {
        identification: 'IDENTIFIED',
        access: 'ACC',
        situation: 'ORDINARY',
        category: 'PRIMARY',
        occupant: 'IDENTIFIED',
      },
      campaignLabel: 'Démonstration Séminaire Filière 2023',
      managementStartDate: new Date().getTime() - 10 * day,
      interviewerStartDate: new Date().getTime() - 10 * day,
      identificationPhaseStartDate: new Date().getTime() - 10 * day,
      collectionStartDate: new Date().getTime() - 10 * day,
      collectionEndDate: new Date().getTime() + 50 * day,
      endDate: new Date().getTime() + 51 * day,
      identificationConfiguration: 'IASCO',
      contactOutcomeConfiguration: 'F2F',
      contactAttemptConfiguration: 'F2F',
      selected: false,
      contactOutcome: {
        date: new Date().getTime() - 2 * day,
        type: contactOutcomeEnum.INTERVIEW_ACCEPTED.type,
        totalNumberOfContactAttempts: 1,
      },
    });
  }
  await userIdbService.insert({
    id: 1,
    title: 'MISTER',
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '0123456789',
    email: 'john@doe.fr',
  });
  await surveyUnitIDBService.addAll(surverUnits);
}

/**
 * Get a random item from an array.
 *
 * @template T
 * @param {T[]} array - The input array.
 * @returns {T[]} - A randomly selected item from the array.
 */
function getRandomItemFromArray(array) {
  // Check if the array is empty
  if (array.length === 0) {
    throw new Error('Array is empty, cannot pick a random item.');
  }

  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generates a random integer between the specified minimum and maximum values (inclusive).
 *
 * @param {number} min - The minimum value of the range.
 * @param {number} max - The maximum value of the range.
 * @returns {number} A random integer between min and max (inclusive).
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  if (min > max) {
    throw new Error('Minimum value must be less than or equal to the maximum value');
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}
