import { SurveyUnit, SurveyUnitPerson, SurveyUnitState } from 'types/pearl';
import { surveyUnitStateEnum } from '../enum/SUStateEnum';
import { surveyUnitIDBService } from '../indexeddb/services/surveyUnit-idb-service';
import { contactOutcomes } from './contacts/ContactOutcome';
import { getRandomIntBetween } from './random';
import { IdentificationConfiguration } from 'utils/enum/identifications/IdentificationsQuestions';
import { communicationStatusEnum } from 'utils/enum/CommunicationEnums';

const day = 60 * 60 * 1000 * 24;
const year = day * 365;

const TODAY = Date.now();

/**
 * Helper to create a basic person
 */
function createPerson(
  id: number,
  name: string,
  email: string,
  phone: string,
  privileged: boolean = false,
  suffix: string = ''
): SurveyUnitPerson {
  const [firstName, lastName] = name.split(' ');
  return {
    id,
    title: id % 2 === 0 ? 'MISS' : 'MISTER',
    firstName: firstName + suffix,
    lastName: lastName + suffix,
    email: email + suffix,
    birthdate: new Date(year - getRandomIntBetween(20, 80)).getTime(),
    favoriteEmail: false,
    privileged,
    phoneNumbers: [
      {
        source: 'FISCAL' as const,
        favorite: false,
        number: phone + suffix,
        id: '',
      },
      {
        source: 'DIRECTORY' as const,
        favorite: true,
        number: phone + suffix + '01',
        id: '',
      },
      ...(privileged
        ? [
            {
              source: 'INTERVIEWER' as const,
              favorite: false,
              number: phone + suffix + '11',
              id: '',
            },
            {
              source: 'INTERVIEWER' as const,
              favorite: false,
              number: phone + suffix + '12',
              id: '',
            },
            {
              source: 'INTERVIEWER' as const,
              favorite: false,
              number: phone + suffix + '13',
              id: '',
            },
          ]
        : []),
    ],
  };
}

/**
 * Helper to create basic address
 */
function createAddress(user: any) {
  return {
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
  };
}

/**
 * Helper to create communication templates
 */
function createCommunicationTemplates() {
  return [
    {
      id: 'LETTER_NOTICE',
      medium: 'LETTER',
      type: 'NOTICE',
    },
    {
      id: 'LETTER_REMINDER',
      medium: 'LETTER',
      type: 'REMINDER',
    },
  ];
}

/**
 * Helper to create communication request with SUBMITTED status
 */
function createSubmittedCommunication(templateId: string, submittedDate: number, reason?: string) {
  return {
    emitter: 'INTERVIEWER' as const,
    communicationTemplateId: templateId,
    reason,
    status: [
      { date: submittedDate - day, status: communicationStatusEnum.INITIATED.value },
      { date: submittedDate - day / 2, status: communicationStatusEnum.READY.value },
      { date: submittedDate, status: communicationStatusEnum.SUBMITTED.value },
    ],
  };
}

/**
 * Helper to create a survey unit from API user
 */
function createSurveyUnitFromUser(user: any, index: number): SurveyUnit {
  const baseStates: SurveyUnitState[] = [
    {
      id: user.id + 1_000,
      date: TODAY - 10 * day,
      type: surveyUnitStateEnum.IN_PREPARATION.type,
    },
  ];

  let states = [...baseStates];
  if (user.id > 2) {
    states.push({
      id: user.id + 2_000,
      date: TODAY - 9 * day,
      type: surveyUnitStateEnum.VISIBLE_AND_CLICKABLE.type,
    });
  }
  if (user.id > 3) {
    states.push({
      date: TODAY - 8 * day,
      type: surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type,
    });
  }
  if (user.id > 4) {
    states.push({
      date: TODAY - 7 * day,
      type: surveyUnitStateEnum.APPOINTMENT_MADE.type,
    });
  }

  const persons = [
    createPerson(user.id, user.name, user.email, user.phone, false),
    createPerson(user.id, user.name, user.email, user.phone, true, '-2'),
    createPerson(user.id, user.name, user.email, user.phone, true, '-2'),
  ];

  return {
    id: `su${user.id}`,
    persons,
    address: createAddress(user),
    priority: user.id % 2 === 0,
    move: false,
    campaign: user.id % 2 === 0 ? 'TestCampaign' : 'SecondTestCampaign',
    comments: [
      { type: 'MANAGEMENT', value: '' },
      { type: 'INTERVIEWER', value: '' },
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
    states,
    contactAttempts: [
      {
        status: 'TUN',
        date: TODAY - getRandomIntBetween(10, 100) * day,
        medium: 'FIELD',
      },
      {
        status: 'INA',
        date: TODAY - getRandomIntBetween(3, 9) * day,
        medium: 'FIELD',
      },
    ],
    identification: {},
    campaignLabel: 'Demonstration Seminaire Filiere 2023',
    managementStartDate: TODAY - 10 * day,
    interviewerStartDate: TODAY - 10 * day,
    identificationPhaseStartDate: TODAY - 10 * day,
    collectionStartDate: TODAY - 10 * day,
    collectionEndDate: TODAY + 50 * day,
    endDate: TODAY + 51 * day,
    identificationConfiguration:
      user.id === 10 ? IdentificationConfiguration.HOUSEF2F : IdentificationConfiguration.INDTEL,
    contactOutcomeConfiguration: 'F2F',
    contactAttemptConfiguration: 'F2F',
    contactOutcome: {
      date: TODAY - 2 * day,
      type: contactOutcomes.INTERVIEW_ACCEPTED.value,
      totalNumberOfContactAttempts: 2,
    },
    displayName: '',
    useLetterCommunication: true,
    communicationRequests: [],
    communicationTemplates: createCommunicationTemplates(),
    collectNextContacts: false,
  };
}

export async function seedData() {
  const surveyUnits: SurveyUnit[] = [];
  const users = await fetch('https://jsonplaceholder.typicode.com/users').then(r => r.json());

  // Create survey units from API users
  for (const user of users) {
    surveyUnits.push(createSurveyUnitFromUser(user, user.id));
  }

  // SU with NO communication requests - should show "Aucun courrier envoyé"
  surveyUnits.push({
    ...surveyUnits[0],
    id: 'su-no-communication',
    communicationRequests: [],
    communicationTemplates: [],
  });

  // SU with communication requests but NONE submitted - should show "Aucun courrier envoyé"
  surveyUnits.push({
    ...surveyUnits[0],
    id: 'su-no-submitted',
    useLetterCommunication: true,
    communicationTemplates: createCommunicationTemplates(),
    communicationRequests: [
      {
        emitter: 'INTERVIEWER',
        communicationTemplateId: 'LETTER_NOTICE',
        status: [
          { date: TODAY - 5 * day, status: communicationStatusEnum.INITIATED.value },
          { date: TODAY - 4 * day, status: communicationStatusEnum.READY.value },
        ],
      },
    ],
  });

  // SU with a single SUBMITTED NOTICE - should show "Courrier - Avis | dd/mm/yyyy"
  surveyUnits.push({
    ...surveyUnits[0],
    id: 'su-notice-sent',
    useLetterCommunication: true,
    communicationTemplates: createCommunicationTemplates(),
    communicationRequests: [createSubmittedCommunication('LETTER_NOTICE', TODAY - 3 * day)],
  });

  // SU with a single SUBMITTED REMINDER with UNREACHABLE reason
  surveyUnits.push({
    ...surveyUnits[0],
    id: 'su-reminder-unreachable',
    useLetterCommunication: true,
    communicationTemplates: createCommunicationTemplates(),
    communicationRequests: [
      createSubmittedCommunication('LETTER_REMINDER', TODAY - 2 * day, 'UNREACHABLE'),
    ],
  });

  // SU with a single SUBMITTED REMINDER with REFUSAL reason
  surveyUnits.push({
    ...surveyUnits[0],
    id: 'su-reminder-refusal',
    useLetterCommunication: true,
    communicationTemplates: createCommunicationTemplates(),
    communicationRequests: [
      createSubmittedCommunication('LETTER_REMINDER', TODAY - day, 'REFUSAL'),
    ],
  });

  // SU with MULTIPLE SUBMITTED communications - should show the most recent one
  surveyUnits.push({
    ...surveyUnits[0],
    id: 'su-multiple-submitted',
    useLetterCommunication: true,
    communicationTemplates: createCommunicationTemplates(),
    communicationRequests: [
      createSubmittedCommunication('LETTER_NOTICE', TODAY - 10 * day),
      createSubmittedCommunication('LETTER_REMINDER', TODAY - 5 * day, 'UNREACHABLE'),
      createSubmittedCommunication('LETTER_NOTICE', TODAY - 1 * day), // Most recent
    ],
  });

  // SU with multiple communications where the most recent is NOT submitted
  surveyUnits.push({
    ...surveyUnits[0],
    id: 'su-recent-not-submitted',
    useLetterCommunication: true,
    communicationTemplates: createCommunicationTemplates(),
    communicationRequests: [
      createSubmittedCommunication('LETTER_NOTICE', TODAY - 10 * day),
      {
        emitter: 'INTERVIEWER',
        communicationTemplateId: 'LETTER_REMINDER',
        reason: 'REFUSAL',
        status: [{ date: TODAY - 1 * day, status: communicationStatusEnum.INITIATED.value }],
      },
    ],
  });

  surveyUnits.push(
    {
      ...surveyUnits[0],
      id: 'sutel',
      identification: undefined,
      identificationConfiguration: IdentificationConfiguration.INDTEL,
      previousContactHistory: {
        contactOutcomeValue: 'INA',
        persons: [],
        comment: '',
        priority: false,
      },
    },
    {
      ...surveyUnits[0],
      id: 'sunoident',
      identification: {},
      identificationConfiguration: IdentificationConfiguration.NOIDENT,
    },
    {
      ...surveyUnits[0],
      id: 'sunoident-empty',
      identification: {},
      identificationConfiguration: IdentificationConfiguration.NOIDENT,
      contactOutcome: undefined,
    },
    {
      ...surveyUnits[0],
      id: 'sunoident-WFT',
      identification: {},
      identificationConfiguration: IdentificationConfiguration.NOIDENT,
      states: [{ type: surveyUnitStateEnum.WAITING_FOR_TRANSMISSION.type, date: 1 }],
      contactOutcome: undefined,
    },
    {
      ...surveyUnits[0],
      managementStartDate: TODAY - 10 * day,
      interviewerStartDate: TODAY - 9 * day,
      identificationPhaseStartDate: TODAY - 8 * day,
      collectionStartDate: TODAY - 7 * day,
      collectionEndDate: TODAY - 6 * day,
      endDate: TODAY + 15 * day,
      id: 'questNotAvailable',
      identification: {},
      identificationConfiguration: IdentificationConfiguration.NOIDENT,
    },
    {
      ...surveyUnits[0],
      managementStartDate: TODAY - 10 * day,
      interviewerStartDate: TODAY - 9 * day,
      identificationPhaseStartDate: TODAY - 8 * day,
      collectionStartDate: TODAY - 7 * day,
      collectionEndDate: TODAY - 6 * day,
      endDate: TODAY + 15 * day,
      id: 'HOUSETEL',
      identification: {},
      identificationConfiguration: IdentificationConfiguration.HOUSETEL,
    },
    {
      ...surveyUnits[0],
      managementStartDate: TODAY - 10 * day,
      interviewerStartDate: TODAY - 9 * day,
      identificationPhaseStartDate: TODAY - 8 * day,
      collectionStartDate: TODAY - 7 * day,
      collectionEndDate: TODAY - 6 * day,
      endDate: TODAY + 15 * day,
      id: 'SRCVREINT',
      identification: {},
      identificationConfiguration: IdentificationConfiguration.SRCVREINT,
    },
    {
      ...surveyUnits[0],
      managementStartDate: TODAY - 10 * day,
      interviewerStartDate: TODAY - 9 * day,
      identificationPhaseStartDate: TODAY - 8 * day,
      collectionStartDate: TODAY - 7 * day,
      collectionEndDate: TODAY - 6 * day,
      endDate: TODAY + 15 * day,
      id: 'INDF2F',
      identification: undefined,
      identificationConfiguration: IdentificationConfiguration.INDF2F,
    }
  );

  await surveyUnitIDBService.addAll(surveyUnits);
}
