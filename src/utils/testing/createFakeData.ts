import { SurveyUnit } from 'types/pearl';

export const createSurveyUnit = (surveyUnit: Partial<SurveyUnit> = {}): SurveyUnit => {
  return {
    displayName: 'John Doe Household',
    id: 'SU12345',
    persons: [
      {
        id: 1,
        title: 'Mr',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        birthdate: 631152000000, // Correspond à une date en timestamp (1er Janvier 1990)
        favoriteEmail: true,
        privileged: false,
        phoneNumbers: [
          {
            source: 'Home',
            favorite: true,
            number: '1234567890',
            id: 'PN1',
          },
          {
            source: 'Work',
            favorite: false,
            number: '0987654321',
            id: 'PN2',
          },
        ],
      },
    ],
    address: {
      l1: '123 Main Street',
      l2: 'Apartment 4B',
      l3: '',
      l4: '',
      l5: '',
      l6: '',
      l7: '',
      elevator: true,
      building: 'A',
      floor: '4',
      door: 'B',
      staircase: '1',
      cityPriorityDistrict: false,
    },
    priority: false,
    move: false,
    campaign: 'Census2024',
    comments: [
      {
        type: 'Note',
        value: 'Respondent prefers contact in the evening.',
      },
    ],
    sampleIdentifiers: {
      bs: 1,
      ec: 'EC123',
      le: 100,
      noi: 2,
      numfa: 3,
      rges: 4,
      ssech: 5,
      nolog: 6,
      nole: 7,
      autre: 'Misc',
      nograp: 'None',
    },
    states: [
      {
        id: 1,
        date: 1700000000000, // Exemple de timestamp pour une date future
        type: 'INITIALIZED',
      },
    ],
    contactAttempts: [
      {
        status: 'SUCCESS',
        date: 1700000000000,
        medium: 'Phone',
      },
    ],
    contactOutcome: {
      date: 1700000000000,
      totalNumberOfContactAttempts: 3,
      type: 'COMPLETED',
    },
    identification: {
      identification: null,
      access: null,
      situation: null,
      category: null,
      occupant: null,
    },
    campaignLabel: '2024 National Census',
    managementStartDate: 1699000000000,
    interviewerStartDate: 1699005000000,
    identificationPhaseStartDate: 1699010000000,
    collectionStartDate: 1699020000000,
    collectionEndDate: 1699500000000,
    endDate: 1699600000000,
    identificationConfiguration: 'Default',
    contactOutcomeConfiguration: 'Default',
    contactAttemptConfiguration: 'Default',
    useLetterCommunication: true,
    communicationRequests: [
      {
        emitter: 'INTERVIEWER',
        communicationTemplateId: 'CT123',
        reason: 'Follow-up call',
        status: [
          {
            date: 1700000000000,
            status: 'SENT',
          },
        ],
      },
    ],
    communicationTemplates: [
      {
        medium: 'Email',
        reason: 'Survey reminder',
        type: 'REMINDER',
        id: 'CT123',
      },
    ],
    ...surveyUnit,
  };
};
