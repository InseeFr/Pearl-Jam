export {};

declare global {
  type SurveyUnitPhoneNumber = {
    source: string;
    favorite: boolean;
    number: string;
  };

  type SurveyUnitPerson = {
    id: number;
    title: string;
    firstName: string;
    lastName: string;
    email: string;
    birthdate: number;
    favoriteEmail: boolean;
    privileged: boolean;
    phoneNumbers: SurveyUnitPhoneNumber[];
  };

  type SurveyUnitAddress = {
    l1: string;
    l2: string;
    l3: string;
    l4: string;
    l5: string;
    l6: string;
    l7: string;
    elevator: boolean;
    building: string;
    floor: string;
    door: string;
    staircase: string;
    cityPriorityDistrict: boolean;
  };

  type SurveyUnitComment = {
    type: string;
    value: string;
  };

  type SurveyUnitState = {
    id: number;
    date: number;
    type: string;
  };

  type SurveyUnitSampleIdentifiers = {
    bs: number;
    ec: string;
    le: number;
    noi: number;
    numfa: number;
    rges: number;
    ssech: number;
    nolog: number;
    nole: number;
    autre: string;
    nograp: string;
  };

  type SurveyUnitIdentification = {
    identification: unknown;
    access: unknown;
    situation: unknown;
    category: unknown;
    occupant: unknown;
  };

  type SurveyUnitContactAttempt = {
    status: string;
    date: number;
    medium: string;
  };

  type SurveyUnitCommunicationRequest = {
    emitter: 'INTERVIEWER' | 'TOOL';
    communicationTemplateId?: string;
    reason?: string;
    status: { date: number; status: string }[];
  };

  type SurveyUnitNewCommunicationRequest = {
    communicationTemplateId: string;
    reason: string;
    creationTimestamp: number;
  };

  type SurveyUnitCommunicationTemplate = {
    medium: string;
    reason: string;
    type: string;
    id: string;
  };

  type SurveyUnit = {
    displayName?: string;
    id: string;
    persons: SurveyUnitPerson[];
    address: SurveyUnitAddress;
    priority: boolean;
    move: boolean;
    campaign: string;
    comments: SurveyUnitComment[];
    sampleIdentifiers: SurveyUnitSampleIdentifiers;
    states: SurveyUnitState[];
    contactAttempts: SurveyUnitContactAttempt[];
    contactOutcome?: { date: number; totalNumberOfContactAttempts: number; type: string };
    identification: SurveyUnitIdentification;
    campaignLabel: string;
    managementStartDate: number;
    interviewerStartDate: number;
    identificationPhaseStartDate: number;
    collectionStartDate: number;
    collectionEndDate: number;
    endDate: number;
    identificationConfiguration: string;
    contactOutcomeConfiguration: string;
    contactAttemptConfiguration: string;
    useLetterCommunication: boolean;
    communicationRequests: SurveyUnitCommunicationRequest[];
    communicationTemplates: SurveyUnitCommunicationTemplate[];
  };

  type Notification = {
    date: number;
    type: string;
    title: string;
    messages: string[];
    state: 'warning' | 'success' | 'error';
    read: boolean;
    detail: string;
    id: number;
  };

  type SyncResult = {
    state: string;
    messages: string[];
    details: {
      transmittedSurveyUnits: Record<string, string[]>;
      loadedSurveyUnits: Record<string, string[]>;
    };
  };
}
