import { Answer } from 'utils/hooks/useIdentificationQuestions';

export type Question = {
  answer: Answer;
  value: string;
};

export type SurveyUnitPhoneNumber = {
  source: string;
  favorite: boolean;
  number: string;
  id: string;
};

export type SurveyUnitPerson = {
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

export type SurveyUnitContactAttempt = {
  status: string;
  date: number;
  medium: string;
};

export type SurveyUnitCommunicationRequest = {
  emitter: 'INTERVIEWER' | 'TOOL';
  communicationTemplateId?: string;
  reason?: string;
  status: { date: number; status: string }[];
};

export type SurveyUnitCommunicationTemplate = {
  medium: string;
  reason: string;
  type: string;
  id: string;
};

export type ContactOutcome = { date: number; totalNumberOfContactAttempts: number; type?: string };

export type SurveyUnit = {
  displayName: string;
  id: string;
  persons: SurveyUnitPerson[];
  address: SurveyUnitAddress;
  priority: boolean;
  move: boolean | null;
  campaign: string;
  comments: SurveyUnitComment[];
  sampleIdentifiers: SurveyUnitSampleIdentifiers;
  states: SurveyUnitState[];
  contactAttempts: SurveyUnitContactAttempt[];
  contactOutcome?: ContactOutcome;
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

export type NotificationState = 'warning' | 'success' | 'error';
export type Notification = {
  date: number;
  type: string;
  title: string;
  messages: string[];
  state: NotificationState;
  read: boolean;
  detail: string;
  id: number;
};

export type SyncResult = {
  state: string;
  messages: string[];
  details: {
    transmittedSurveyUnits: Record<string, string[]>;
    loadedSurveyUnits: Record<string, string[]>;
  };
};
