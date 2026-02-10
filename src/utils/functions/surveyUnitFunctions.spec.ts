import { surveyUnitStateEnum } from 'utils/enum/SUStateEnum';
import {
  getContactAttemptNumber,
  isSelectable,
  isQuestionnaireAvailable,
  getCommentByType,
  getAge,
  lastContactAttemptIsSuccessfull,
  areCaEqual,
} from 'utils/functions/index';
import { afterAll, beforeAll, describe, expect, it, Mock, vi } from 'vitest';
import { contactAttempts } from './contacts/ContactAttempt';
import { surveyUnitIDBService } from 'utils/indexeddb/services/surveyUnit-idb-service';
import { createStateIdsAndCommunicationRequestIds, getTitle } from './surveyUnitFunctions';
import { SurveyUnit, SurveyUnitContactAttempt, SurveyUnitState } from 'types/pearl';
import { createSurveyUnit } from 'utils/testing/createFakeData';
import { TITLES } from 'utils/constants';

const mockedEmptySu = {} as unknown as SurveyUnit;
const mockedSu = createSurveyUnit();

describe('getAge', () => {
  it('should return undefined for an empty or invalid birthdate', () => {
    expect(getAge('')).toBeUndefined();
  });

  it('should return the correct age for a valid birthdate', () => {
    const birthdate = new Date();
    birthdate.setFullYear(birthdate.getFullYear() - 30);
    expect(getAge(birthdate.toISOString())).toBe(30);
  });

  it('should correctly handle birthdates in ISO format', () => {
    const birthdate = new Date();
    birthdate.setFullYear(birthdate.getFullYear() - 25);
    expect(getAge(birthdate.toISOString())).toBe(25);
  });

  it('should return 0 if the birthdate is today', () => {
    const today = new Date().toISOString().split('T')[0];
    expect(getAge(today)).toBe(0);
  });
});

describe('getCommentByType', () => {
  const noCommentsFieldSu = mockedEmptySu;
  const emptyCommentsSu = { ...mockedEmptySu, comments: [] };
  const mockedSuNoComment = { ...mockedSu, comments: [] };
  const interviewercomment = { type: 'INTERVIEWER', value: 'Beware of the dog!' };
  const managementComment = { type: 'MANAGEMENT', value: 'Use email first' };
  it('should return empty string if su has no comments attribute with same value', () => {
    expect(getCommentByType('INTERVIEWER', noCommentsFieldSu)).toEqual('');
    expect(getCommentByType('INTERVIEWER', emptyCommentsSu)).toEqual('');
    expect(
      getCommentByType('INTERVIEWER', { ...mockedSuNoComment, comments: [managementComment] })
    ).toEqual('');
    expect(
      getCommentByType('MANAGEMENT', { ...mockedSuNoComment, comments: [interviewercomment] })
    ).toEqual('');
  });
  it('should return comment value of matching value comment', () => {
    expect(
      getCommentByType('INTERVIEWER', {
        ...mockedSu,
        comments: [interviewercomment, managementComment],
      })
    ).toEqual('Beware of the dog!');
    expect(
      getCommentByType('MANAGEMENT', {
        ...mockedSu,
        comments: [interviewercomment, managementComment],
      })
    ).toEqual('Use email first');
  });
});

describe('getContactAttemptNumber', () => {
  it('should return 0 contacts attempts if no contactAttempts in states', async () => {
    const surveyUnit = { ...mockedSu, states: [] };
    const statesWithNoContactAttempt = {
      id: 1,
      type: surveyUnitStateEnum.APPOINTMENT_MADE.type,
      date: 1616070963000,
    };

    expect(
      getContactAttemptNumber({ ...surveyUnit, states: [statesWithNoContactAttempt] })
    ).toEqual(0);
    expect(getContactAttemptNumber(surveyUnit)).toEqual(0);
  });
  it('should return number of contact attempts', () => {
    const statesWithOneContactAttempt: SurveyUnitState[] = [
      { type: surveyUnitStateEnum.APPOINTMENT_MADE.type, date: 1616070963000 },
      { type: surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type, date: 1616070963000 },
    ];
    const statesWithTwoContactAttempt: SurveyUnitState[] = [
      { type: surveyUnitStateEnum.APPOINTMENT_MADE.type, date: 1616070963000 },
      { type: surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type, date: 1616070963000 },
      { type: surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type, date: 1616070963000 },
      { type: surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type, date: 1616070963000 },
    ];
    expect(getContactAttemptNumber({ ...mockedSu, states: statesWithOneContactAttempt })).toEqual(
      1
    );
    expect(getContactAttemptNumber({ ...mockedSu, states: statesWithTwoContactAttempt })).toEqual(
      3
    );
  });
});

describe('isSelectable', () => {
  beforeAll(() => {
    vi.useFakeTimers().setSystemTime(new Date(2021, 2, 15).getTime());
  });
  afterAll(() => {
    vi.useRealTimers();
  });
  it('should return false if date not in range', () => {
    const su = createSurveyUnit();
    const surveyUnitBefore = {
      ...su,
      identificationPhaseStartDate: new Date(2021, 1, 1).getTime(),
      endDate: new Date(2021, 1, 31).getTime(),
    };
    const surveyUnitAfter = {
      ...su,
      identificationPhaseStartDate: new Date(2021, 3, 1).getTime(),
      endDate: new Date(2021, 3, 31).getTime(),
    };
    expect(isSelectable(surveyUnitBefore)).toEqual(false);
    expect(isSelectable(surveyUnitAfter)).toEqual(false);
  });
  it('should return true if date in range', () => {
    const surveyUnitInRange = {
      ...mockedSu,
      identificationPhaseStartDate: new Date(2021, 2, 1).getTime(),
      endDate: new Date(2021, 3, 31).getTime(),
    };
    expect(isSelectable(surveyUnitInRange)).toEqual(true);
  });
});

describe('isQuestionnaireAvailable', () => {
  beforeAll(() => {
    vi.useFakeTimers().setSystemTime(new Date(2021, 2, 15).getTime());
  });
  afterAll(() => {
    vi.useRealTimers();
  });
  const suInRange = {
    ...mockedSu,
    collectionStartDate: new Date(2021, 2, 1).getTime(),
    collectionEndDate: new Date(2021, 3, 1).getTime(),
  };
  const suBefore = {
    ...mockedSu,
    collectionStartDate: new Date(2021, 1, 1).getTime(),
    collectionEndDate: new Date(2021, 2, 1).getTime(),
  };
  const suAfter = {
    ...mockedSu,
    collectionStartDate: new Date(2021, 3, 1).getTime(),
    collectionEndDate: new Date(2021, 4, 1).getTime(),
  };
  it('should return false if SU is inaccessible', () => {
    expect(isQuestionnaireAvailable(suInRange)(true)).toEqual(false);
  });
  it('should return false if SU is accessible and current date not in collection period', () => {
    expect(isQuestionnaireAvailable(suBefore)(false)).toEqual(false);
    expect(isQuestionnaireAvailable(suAfter)(false)).toEqual(false);
  });
  it('should return true if SU is accessible and current date in collection period', () => {
    expect(isQuestionnaireAvailable(suInRange)(false)).toEqual(true);
  });
});

describe('areCasEqual', () => {
  const suContactAttempt: SurveyUnitContactAttempt = {
    date: 1000,
    status: contactAttempts.APPOINTMENT_MADE.value,
    medium: 'TEL',
  };

  const suContactAttempt2: SurveyUnitContactAttempt = {
    date: 2000,
    status: contactAttempts.APPOINTMENT_MADE.value,
    medium: 'FIELD',
  };

  const suContactAttempt3: SurveyUnitContactAttempt = {
    date: 1000,
    status: contactAttempts.APPOINTMENT_MADE.value,
    medium: 'FIELD',
  };
  it('should return false if one argument is falsy', () => {
    expect(areCaEqual()).toEqual(false);
    expect(areCaEqual(undefined, suContactAttempt)).toEqual(false);
    expect(areCaEqual(suContactAttempt)).toEqual(false);
  });
  it('should return false if at least one attribute is different', () => {
    expect(areCaEqual(suContactAttempt2, suContactAttempt3)).toEqual(false);
    expect(areCaEqual(suContactAttempt, suContactAttempt2)).toEqual(false);
  });
  it('should return true if date and status are equal', () => {
    expect(areCaEqual(suContactAttempt3, suContactAttempt)).toEqual(true);
  });
});

describe('lastContactAttemptIsSuccessfull', () => {
  it('should return false if no contactAttempts', () => {
    expect(lastContactAttemptIsSuccessfull({ ...mockedSu, contactAttempts: [] })).toEqual(false);
  });
  it('should return false if cas contains no successfull ca', () => {
    expect(
      lastContactAttemptIsSuccessfull({
        ...mockedSu,
        contactAttempts: [{ date: 1, status: contactAttempts.NO_CONTACT.value, medium: 'TEL' }],
      })
    ).toEqual(false);
  });
  it('should return false if successfull ca is not last ca', () => {
    expect(
      lastContactAttemptIsSuccessfull({
        ...mockedSu,
        contactAttempts: [
          { date: 1, status: contactAttempts.INTERVIEW_ACCEPTED.value, medium: 'TEL' },
          { date: 2, status: contactAttempts.NO_CONTACT.value, medium: 'TEL' },
        ],
      })
    ).toEqual(false);
  });
  it('should return true if last ca is successfull', () => {
    expect(
      lastContactAttemptIsSuccessfull({
        ...mockedSu,
        contactAttempts: [
          { date: 1, status: contactAttempts.NO_CONTACT.value, medium: 'TEL' },
          { date: 2, status: contactAttempts.INTERVIEW_ACCEPTED.value, medium: 'TEL' },
        ],
      })
    ).toEqual(true);
  });
});

describe('createStateIdsAndCommunicationRequestIds', () => {
  vi.mock('utils/indexeddb/services/surveyUnit-idb-service', () => ({
    surveyUnitIDBService: {
      getById: vi.fn(),
      addOrUpdateSU: vi.fn(),
    },
  }));

  it('should fetch the previous survey unit and persist the updated data', async () => {
    const latestSurveyUnit: SurveyUnit = {
      ...mockedSu,
      id: '123',
      states: [
        { date: 1600000000000, type: 'AOC' },
        { date: 1610000000000, type: 'APS' },
      ],
      communicationRequests: [
        { emitter: 'INTERVIEWER', status: [] },
        { emitter: 'INTERVIEWER', status: [] },
      ],
    };
    const previousSurveyUnit: SurveyUnit = {
      ...mockedSu,
      id: '123',
      states: [{ date: 1590000000000, type: 'VIN' }],
      communicationRequests: [{ emitter: 'INTERVIEWER', status: [] }],
    };

    (surveyUnitIDBService.getById as Mock).mockResolvedValue(previousSurveyUnit);

    await createStateIdsAndCommunicationRequestIds(latestSurveyUnit);

    expect(surveyUnitIDBService.getById).toHaveBeenCalledWith('123');
    expect(surveyUnitIDBService.addOrUpdateSU).toHaveBeenCalledWith({
      ...previousSurveyUnit,
      states: latestSurveyUnit.states,
      communicationRequests: latestSurveyUnit.communicationRequests,
    });
  });
});

describe('getContactPersonTitle', () => {
  it('should return empty string if no contact person', () => {
    expect(getTitle('MISTER')).toEqual(TITLES.MISTER.value);
    expect(getTitle('MISS')).toEqual(TITLES.MISS.value);
  });
});
