import {
  SurveyUnit,
  SurveyUnitCommunicationRequest,
  SurveyUnitCommunicationTemplate,
} from 'types/pearl';
import { TITLES } from 'utils/constants';
import { getRecipientInformation } from 'utils/functions/index';
import {
  getLastSubmittedCommunication,
  formatLastMailInfo,
} from 'utils/functions/communicationFunctions';
import { CommunicationStatus, communicationStatusEnum } from 'utils/enum/CommunicationEnums';
import { describe, expect, it, vi } from 'vitest';
import { IdentificationConfiguration } from 'utils/enum/identifications/IdentificationsQuestions';

describe('getRecipientInformation', () => {
  const VALID_FIRSTNAME1 = 'Ada';
  const VALID_LASTNAME1 = 'Lovelace';
  const VALID_FIRSTNAME2 = 'Charles';
  const VALID_LASTNAME2 = 'Babbage';

  const ADA = {
    title: TITLES.MISS.type,
    firstName: VALID_FIRSTNAME1,
    lastName: VALID_LASTNAME1,
  };
  const BABBAGE = {
    title: TITLES.MISTER.type,
    firstName: VALID_FIRSTNAME2,
    lastName: VALID_LASTNAME2,
  };

  const onePersonvalidPersons = [
    {
      privileged: true,
      ...ADA,
    },
  ];
  const validPrivilegedFirstPersons = [
    {
      privileged: true,
      ...ADA,
    },
    {
      privileged: false,
      ...BABBAGE,
    },
  ];
  const validPrivilegedSecondPersons = [
    {
      privileged: false,
      ...ADA,
    },
    {
      privileged: true,
      ...BABBAGE,
    },
  ];

  // addresses
  const VALID_POSTCODE = '123456';
  const VALID_CITYNAME = 'Champagnole';
  const VALID_ADDRESS_INPUT = `${VALID_POSTCODE} ${VALID_CITYNAME}`;
  const validAddress = { l6: VALID_ADDRESS_INPUT };
  const richValidAddress = { ...validAddress, elevator: true, cityPriorityDistrict: false };

  const minimalValidSurveyUnit = {
    persons: onePersonvalidPersons,
    address: validAddress,
  } as unknown as SurveyUnit;
  const firstPersonValidSurveyUnit = {
    persons: validPrivilegedFirstPersons,
    address: validAddress,
  } as unknown as SurveyUnit;
  const secondPersonValidSurveyUnit = {
    persons: validPrivilegedSecondPersons,
    address: validAddress,
  } as unknown as SurveyUnit;

  const richAddressValidSurveyUnit = {
    persons: onePersonvalidPersons,
    address: richValidAddress,
  } as unknown as SurveyUnit;

  it('accepts single person and the simplest address', () => {
    expect(getRecipientInformation(minimalValidSurveyUnit)).toEqual(
      generateExpectedOutput(ADA, VALID_CITYNAME, VALID_POSTCODE)
    );
  });
  it('accepts two persons with first person as privileged and the simplest address', () => {
    expect(getRecipientInformation(firstPersonValidSurveyUnit)).toEqual(
      generateExpectedOutput(ADA, VALID_CITYNAME, VALID_POSTCODE)
    );
  });
  it('accepts two persons with second person as privileged and the simplest address', () => {
    expect(getRecipientInformation(secondPersonValidSurveyUnit)).toEqual(
      generateExpectedOutput(BABBAGE, VALID_CITYNAME, VALID_POSTCODE)
    );
  });

  it('accepts single person and complexe address', () => {
    expect(getRecipientInformation(richAddressValidSurveyUnit)).toEqual(
      generateExpectedOutput(ADA, VALID_CITYNAME, VALID_POSTCODE)
    );
  });
  const generateExpectedOutput = (
    person: { title: string; firstName: string; lastName: string },
    cityName: string,
    postCode: string
  ) => ({
    title: person.title,
    recipientFirstName: person.firstName,
    recipientLastName: person.lastName,
    recipientCityName: cityName,
    recipientPostcode: postCode,
    address: [
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ],
  });
});

// =============================================================================
// Tests for getLastSubmittedCommunication
// =============================================================================

describe('getLastSubmittedCommunication', () => {
  const COMMUNICATION_TEMPLATES: SurveyUnitCommunicationTemplate[] = [
    { id: 'LETTER_NOTICE', medium: 'LETTER', type: 'NOTICE' },
    { id: 'LETTER_REMINDER', medium: 'LETTER', type: 'REMINDER' },
  ];

  const createSurveyUnit = (
    communicationRequests: SurveyUnitCommunicationRequest[] = [],
    communicationTemplates: SurveyUnitCommunicationTemplate[] = COMMUNICATION_TEMPLATES
  ): SurveyUnit => ({
    id: 'su-test',
    persons: [],
    address: {
      l1: '',
      l2: '',
      l3: '',
      l4: '',
      l5: '',
      l6: '',
      l7: '',
      elevator: false,
      building: '',
      floor: '',
      door: '',
      staircase: '',
      cityPriorityDistrict: false,
    },
    priority: false,
    move: null,
    campaign: 'TestCampaign',
    comments: [],
    sampleIdentifiers: {
      bs: 0,
      ec: '0',
      le: 0,
      noi: 0,
      numfa: 0,
      rges: 0,
      ssech: 0,
      nolog: 0,
      nole: 0,
      autre: '',
      nograp: '',
    },
    states: [],
    contactAttempts: [],
    identification: {},
    campaignLabel: '',
    managementStartDate: 0,
    interviewerStartDate: 0,
    identificationPhaseStartDate: 0,
    collectionStartDate: 0,
    collectionEndDate: 0,
    endDate: 0,
    identificationConfiguration: IdentificationConfiguration.INDTEL,
    contactOutcomeConfiguration: 'F2F',
    contactAttemptConfiguration: 'F2F',
    useLetterCommunication: true,
    communicationRequests,
    communicationTemplates,
    collectNextContacts: false,
    displayName: '',
  });

  const createCommunicationRequest = (
    templateId: string,
    statuses: { date: number; status: CommunicationStatus }[],
    reason?: string
  ): SurveyUnitCommunicationRequest => ({
    emitter: 'INTERVIEWER',
    communicationTemplateId: templateId,
    reason,
    status: statuses,
  });

  it('should return null when there are no communication requests', () => {
    const surveyUnit = createSurveyUnit([]);
    expect(getLastSubmittedCommunication(surveyUnit)).toBeNull();
  });

  it('should return null when there are communication requests but none with SUBMITTED status', () => {
    const surveyUnit = createSurveyUnit([
      createCommunicationRequest('LETTER_NOTICE', [
        { date: 1000, status: communicationStatusEnum.INITIATED.value },
        { date: 2000, status: communicationStatusEnum.READY.value },
      ]),
    ]);
    expect(getLastSubmittedCommunication(surveyUnit)).toBeNull();
  });

  it('should return the communication request with SUBMITTED status', () => {
    const surveyUnit = createSurveyUnit([
      createCommunicationRequest('LETTER_NOTICE', [
        { date: 1000, status: communicationStatusEnum.INITIATED.value },
        { date: 2000, status: communicationStatusEnum.READY.value },
        { date: 3000, status: communicationStatusEnum.SUBMITTED.value },
      ]),
    ]);
    const result = getLastSubmittedCommunication(surveyUnit);
    expect(result).not.toBeNull();
    expect(result?.type).toBe('NOTICE');
    expect(result?.medium).toBe('LETTER');
    expect(result?.date).toBe(3000);
  });

  it('should ignore a communication request with an empty status array', () => {
    const surveyUnit = createSurveyUnit([
      createCommunicationRequest('LETTER_NOTICE', []), // no statuses at all
      createCommunicationRequest('LETTER_REMINDER', [
        { date: 2000, status: communicationStatusEnum.SUBMITTED.value },
      ]),
    ]);
    const result = getLastSubmittedCommunication(surveyUnit);
    expect(result).not.toBeNull();
    expect(result?.type).toBe('REMINDER');
    expect(result?.date).toBe(2000);
  });

  it('should return the single SUBMITTED communication when only one exists (reduce with one element)', () => {
    const surveyUnit = createSurveyUnit([
      createCommunicationRequest('LETTER_NOTICE', [
        { date: 1500, status: communicationStatusEnum.SUBMITTED.value },
      ]),
    ]);
    const result = getLastSubmittedCommunication(surveyUnit);
    expect(result).not.toBeNull();
    expect(result?.date).toBe(1500);
  });

  it('should return the most recent SUBMITTED communication when there are multiple', () => {
    const surveyUnit = createSurveyUnit([
      createCommunicationRequest('LETTER_NOTICE', [
        { date: 1000, status: communicationStatusEnum.SUBMITTED.value },
      ]),
      createCommunicationRequest(
        'LETTER_REMINDER',
        [{ date: 5000, status: communicationStatusEnum.SUBMITTED.value }],
        'UNREACHABLE'
      ),
      createCommunicationRequest('LETTER_NOTICE', [
        { date: 3000, status: communicationStatusEnum.SUBMITTED.value },
      ]),
    ]);
    const result = getLastSubmittedCommunication(surveyUnit);
    expect(result).not.toBeNull();
    expect(result?.type).toBe('REMINDER');
    expect(result?.reason).toBe('UNREACHABLE');
    expect(result?.date).toBe(5000);
  });

  it('should return the communication with the most recent SUBMITTED date when a request has multiple SUBMITTED statuses', () => {
    const surveyUnit = createSurveyUnit([
      createCommunicationRequest('LETTER_NOTICE', [
        { date: 1000, status: communicationStatusEnum.SUBMITTED.value },
        { date: 2000, status: communicationStatusEnum.READY.value },
        { date: 3000, status: communicationStatusEnum.SUBMITTED.value },
      ]),
    ]);
    const result = getLastSubmittedCommunication(surveyUnit);
    expect(result).not.toBeNull();
    expect(result?.date).toBe(3000);
  });

  it('should handle missing communicationTemplateId gracefully', () => {
    const surveyUnit = createSurveyUnit([
      createCommunicationRequest('NON_EXISTENT_TEMPLATE', [
        { date: 1000, status: communicationStatusEnum.SUBMITTED.value },
      ]),
    ]);
    const result = getLastSubmittedCommunication(surveyUnit);
    expect(result).not.toBeNull();
    expect(result?.type).toBeUndefined();
    expect(result?.medium).toBeUndefined();
    expect(result?.date).toBe(1000);
  });
});

// =============================================================================
// Tests for formatLastMailInfo
// =============================================================================

describe('formatLastMailInfo', () => {
  // Note: formatLastMailInfo depends on i18n translations and formatDate
  // These tests verify the logic structure rather than exact output strings

  it('should return noMailSent translation when lastMailInfo is null', () => {
    const result = formatLastMailInfo(null);
    // Should return the translation for "Aucun courrier envoyé"
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('should return noMailSent translation when lastMailInfo has no date', () => {
    const lastMailInfo = {
      type: 'NOTICE',
      medium: 'LETTER',
      reason: undefined,
      date: null,
      template: undefined,
    };
    const result = formatLastMailInfo(lastMailInfo);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('should include medium and type for NOTICE without reason', () => {
    const lastMailInfo = {
      type: 'NOTICE',
      medium: 'LETTER',
      reason: undefined,
      date: 1718764800000,
      template: undefined,
    };
    const result = formatLastMailInfo(lastMailInfo);
    expect(result).toContain('Mail');
    expect(result).toContain('Notice');

    // Should NOT contain reason for NOTICE
    expect(result).not.toContain('Unreachable');
    expect(result).not.toContain('Refusal');
  });

  it('should include reason for REMINDER with UNREACHABLE', () => {
    const lastMailInfo = {
      type: 'REMINDER',
      medium: 'LETTER',
      reason: 'UNREACHABLE',
      date: 1718764800000,
      template: undefined,
    };
    const result = formatLastMailInfo(lastMailInfo);
    expect(result).toContain('Mail');
    expect(result).toContain('Reminder');
    expect(result).toContain('Unreachable');
  });

  it('should include reason for REMINDER with REFUSAL', () => {
    const lastMailInfo = {
      type: 'REMINDER',
      medium: 'LETTER',
      reason: 'REFUSAL',
      date: 1718764800000,
      template: undefined,
    };
    const result = formatLastMailInfo(lastMailInfo);
    expect(result).toContain('Refusal');
  });

  it('should not include reason for NOTICE even if reason is present', () => {
    const lastMailInfo = {
      type: 'NOTICE',
      medium: 'LETTER',
      reason: 'UNREACHABLE',
      date: 1718764800000,
      template: undefined,
    };
    const result = formatLastMailInfo(lastMailInfo);
    expect(result).toContain('Notice');
    expect(result).not.toContain('Unreachable');
  });

  it('should handle undefined type and medium gracefully', () => {
    const lastMailInfo = {
      type: undefined,
      medium: undefined,
      reason: undefined,
      date: 1718764800000,
      template: undefined,
    };
    const result = formatLastMailInfo(lastMailInfo);
    expect(typeof result).toBe('string');
    expect(result).toContain('|');
  });
});
