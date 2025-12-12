import { SurveyUnit } from 'types/pearl';
import { surveyUnitStateEnum } from '../enum/SUStateEnum';
import { surveyUnitIDBService } from '../indexeddb/services/surveyUnit-idb-service';
import { contactOutcomes } from './contacts/ContactOutcome';
import { getRandomIntBetween } from './random';
import { IdentificationConfiguration } from 'utils/enum/identifications/IdentificationsQuestions';

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
  const surverUnits: SurveyUnit[] = [];
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
          title: ['MISS', 'MISTER'][user.id % 2],
          firstName: user.name.split(' ')[0],
          lastName: user.name.split(' ')[1],
          email: user.email,
          birthdate: new Date(year - getRandomIntBetween(20, 80)).getTime(),
          favoriteEmail: false,
          privileged: false,
          phoneNumbers: [
            {
              source: 'FISCAL',
              favorite: false,
              number: user.phone,
              id: '',
            },
            {
              source: 'DIRECTORY',
              favorite: true,
              number: user.phone + '01',
              id: '',
            },
          ],
        },
        {
          id: user.id,
          title: ['MISS', 'MISTER'][user.id % 2],
          firstName: user.name.split(' ')[0] + '-2',
          lastName: user.name.split(' ')[1] + '-2',
          email: user.email + '-2',
          birthdate: new Date(year - getRandomIntBetween(20, 80)).getTime(),
          favoriteEmail: false,
          privileged: true,
          phoneNumbers: [
            {
              source: 'FISCAL',
              favorite: false,
              number: user.phone + '-2',
              id: '',
            },
            {
              source: 'DIRECTORY',
              favorite: true,
              number: user.phone + '-2',
              id: '',
            },
            {
              source: 'INTERVIEWER',
              favorite: false,
              number: user.phone + '11',
              id: '',
            },
            {
              source: 'INTERVIEWER',
              favorite: false,
              number: user.phone + '12',
              id: '',
            },
            {
              source: 'INTERVIEWER',
              favorite: false,
              number: user.phone + '13',
              id: '',
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
      priority: user.id % 2 === 0,
      move: false,
      campaign: user.id % 2 === 0 ? 'TestCampaign' : 'SecondTestCampaign',
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
        ssech: user.id % 2 === 0 ? 1 : 2,
        nolog: 0,
        nole: 0,
        autre: '',
        nograp: user.id % 2 === 0 ? '1' : '2',
      },
      states: states,
      contactAttempts: [
        {
          status: 'TUN',
          date: new Date().getTime() - getRandomIntBetween(10, 100) * day,
          medium: 'FIELD',
        },
        {
          status: 'INA',
          date: new Date().getTime() - getRandomIntBetween(3, 9) * day,
          medium: 'FIELD',
        },
      ],
      identification: {},
      campaignLabel: 'Démonstration Séminaire Filière 2023',
      managementStartDate: new Date().getTime() - 10 * day,
      interviewerStartDate: new Date().getTime() - 10 * day,
      identificationPhaseStartDate: new Date().getTime() - 10 * day,
      collectionStartDate: new Date().getTime() - 10 * day,
      collectionEndDate: new Date().getTime() + 50 * day,
      endDate: new Date().getTime() + 51 * day,
      identificationConfiguration:
        user.id === 10 ? IdentificationConfiguration.HOUSEF2F : IdentificationConfiguration.INDTEL,
      contactOutcomeConfiguration: 'F2F',
      contactAttemptConfiguration: 'F2F',
      contactOutcome: {
        date: new Date().getTime() - 2 * day,
        type: contactOutcomes.INTERVIEW_ACCEPTED.value,
        totalNumberOfContactAttempts: 2,
      },
    });
  }
  // Create a fillable TEL surveyUnit
  surverUnits.push({
    ...surverUnits[0],
    id: 'sutel',
    identification: undefined,
    identificationConfiguration: IdentificationConfiguration.INDTEL,
    previousContactHistory: {
      contactOutcomeValue: 'INA',
      persons: [],
      comment: '',
      priority: false,
    },
  });
  surverUnits.push({
    ...surverUnits[0],
    id: 'sunoident',
    identification: {},
    identificationConfiguration: IdentificationConfiguration.NOIDENT,
  });
  surverUnits.push({
    ...surverUnits[0],
    id: 'sunoident-empty',
    identification: {},
    identificationConfiguration: IdentificationConfiguration.NOIDENT,
    contactOutcome: undefined,
  });
  surverUnits.push({
    ...surverUnits[0],
    id: 'sunoident-WFT',
    identification: {},
    identificationConfiguration: IdentificationConfiguration.NOIDENT,
    states: [{ type: surveyUnitStateEnum.WAITING_FOR_TRANSMISSION.type, date: 1 }],
    contactOutcome: undefined,
  });
  surverUnits.push({
    ...surverUnits[0],
    managementStartDate: new Date().getTime() - 10 * day,
    interviewerStartDate: new Date().getTime() - 9 * day,
    identificationPhaseStartDate: new Date().getTime() - 8 * day,
    collectionStartDate: new Date().getTime() - 7 * day,
    collectionEndDate: new Date().getTime() - 6 * day,
    endDate: new Date().getTime() + 15 * day,
    id: 'questNotAvailable',
    identification: {},
    identificationConfiguration: IdentificationConfiguration.NOIDENT,
  });
  surverUnits.push({
    ...surverUnits[0],
    managementStartDate: new Date().getTime() - 10 * day,
    interviewerStartDate: new Date().getTime() - 9 * day,
    identificationPhaseStartDate: new Date().getTime() - 8 * day,
    collectionStartDate: new Date().getTime() - 7 * day,
    collectionEndDate: new Date().getTime() - 6 * day,
    endDate: new Date().getTime() + 15 * day,
    id: 'HOUSETEL',
    identification: {},
    identificationConfiguration: IdentificationConfiguration.HOUSETEL,
  });
  surverUnits.push({
    ...surverUnits[0],
    managementStartDate: new Date().getTime() - 10 * day,
    interviewerStartDate: new Date().getTime() - 9 * day,
    identificationPhaseStartDate: new Date().getTime() - 8 * day,
    collectionStartDate: new Date().getTime() - 7 * day,
    collectionEndDate: new Date().getTime() - 6 * day,
    endDate: new Date().getTime() + 15 * day,
    id: 'SRCVREINT',
    identification: {},
    identificationConfiguration: IdentificationConfiguration.SRCVREINT,
  });
  surverUnits.push({
    ...surverUnits[0],
    managementStartDate: new Date().getTime() - 10 * day,
    interviewerStartDate: new Date().getTime() - 9 * day,
    identificationPhaseStartDate: new Date().getTime() - 8 * day,
    collectionStartDate: new Date().getTime() - 7 * day,
    collectionEndDate: new Date().getTime() - 6 * day,
    endDate: new Date().getTime() + 15 * day,
    id: 'INDF2F',
    identification: undefined,

    identificationConfiguration: IdentificationConfiguration.INDF2F,
  });

  await surveyUnitIDBService.addAll(surverUnits);
}
