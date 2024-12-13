import { surveyUnitStateEnum } from 'utils/enum/SUStateEnum';
import { contactAttemptEnum } from 'utils/enum/ContactAttemptEnum';
import { contactOutcomeEnum } from 'utils/enum/ContactOutcomeEnum';
import {
  getContactAttemptNumber,
  getLastState,
  isSelectable,
  updateStateWithDates,
  isQuestionnaireAvailable,
  getCommentByType,
  getAge,
  isValidForTransmission,
  lastContactAttemptIsSuccessfull,
  areCaEqual,
} from 'utils/functions/index';

describe('getAge', () => {
  it('should return undefined for an empty or invalid birthdate', () => {
    expect(getAge('')).toBeUndefined();
    expect(getAge(null)).toBeUndefined();
    expect(getAge(undefined)).toBeUndefined();
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
  const noCommentsSu = {};
  const emptyCommentsSu = { comments: [] };
  const interviewercomment = { type: 'INTERVIEWER', value: 'Beware of the dog!' };
  const managementComment = { type: 'MANAGEMENT', value: 'Use email first' };
  it('should return empty string if su has no comments attribute with same type', () => {
    expect(getCommentByType('INTERVIEWER', noCommentsSu)).toEqual('');
    expect(getCommentByType('INTERVIEWER', emptyCommentsSu)).toEqual('');
    expect(getCommentByType('INTERVIEWER', { comments: [managementComment] })).toEqual('');
    expect(getCommentByType('MANAGEMENT', { comments: [interviewercomment] })).toEqual('');
  });
  it('should return comment value of matching type comment', () => {
    expect(
      getCommentByType('INTERVIEWER', { comments: [interviewercomment, managementComment] })
    ).toEqual('Beware of the dog!');
    expect(
      getCommentByType('MANAGEMENT', { comments: [interviewercomment, managementComment] })
    ).toEqual('Use email first');
  });
});

describe('getLastState', () => {
  it('should return the only state', () => {
    expect(getLastState([{ id: 1, date: 1616070963000 }])).toEqual({
      id: 1,
      date: 1616070963000,
    });
  });
  it('should return undefined if empty states', () => {
    expect(getLastState([])).toEqual(undefined);
  });
  it('should return state with latest date', () => {
    expect(
      getLastState([
        { id: 1, date: 1616070963000 },
        { id: 2, date: 1616070000000 },
      ])
    ).toEqual({
      id: 1,
      date: 1616070963000,
    });
  });
});

describe('getContactAttemptNumber', () => {
  it('should return 0 contacts attempts if no contactAttempts in states', async () => {
    const surveyUnit = { states: [] };
    const statesWithNoContactAttempt = [surveyUnitStateEnum.APPOINTMENT_MADE];
    expect(getContactAttemptNumber({ ...surveyUnit, states: statesWithNoContactAttempt })).toEqual(
      0
    );
    expect(getContactAttemptNumber(surveyUnit)).toEqual(0);
  });
  it('should return number of contact attempts', () => {
    const statesWithOneContactAttempt = [
      surveyUnitStateEnum.APPOINTMENT_MADE,
      surveyUnitStateEnum.AT_LEAST_ONE_CONTACT,
    ];
    const statesWithTwoContactAttempt = [
      surveyUnitStateEnum.APPOINTMENT_MADE,
      surveyUnitStateEnum.AT_LEAST_ONE_CONTACT,
      surveyUnitStateEnum.AT_LEAST_ONE_CONTACT,
    ];
    expect(getContactAttemptNumber({ states: [...statesWithOneContactAttempt] })).toEqual(1);
    expect(getContactAttemptNumber({ states: [...statesWithTwoContactAttempt] })).toEqual(2);
  });
});
describe('updateStateWithDates', () => {
  const NOW = new Date(2021, 2, 15).getTime();
  beforeAll(() => {
    vi.useFakeTimers('modern').setSystemTime(NOW);
  });
  afterAll(() => {
    vi.useRealTimers();
  });
  const beforeCurrent = new Date(2021, 2, 10).getTime();
  const afterCurrent = new Date(2021, 2, 20).getTime();
  it('should return initial states if lastState is not VNC', () => {
    const surveyUnit = {};
    expect(updateStateWithDates(surveyUnit)).toEqual([]);
    expect(updateStateWithDates({ states: [] })).toEqual([]);
  });
  it('should return initial states if SU lastState is VNC and currentDate < identificationPhaseStart', () => {
    const surveyUnit = {
      states: [surveyUnitStateEnum.VISIBLE_NOT_CLICKABLE],
      identificationPhaseStartDate: afterCurrent,
    };
    expect(updateStateWithDates(surveyUnit)).toEqual([surveyUnitStateEnum.VISIBLE_NOT_CLICKABLE]);
  });
  it('should return 1 if SU is VNC and currentDate > identificationPhaseStart', () => {
    const surveyUnit = {
      states: [{ type: surveyUnitStateEnum.VISIBLE_NOT_CLICKABLE.type, date: beforeCurrent }],
      identificationPhaseStartDate: beforeCurrent,
    };
    expect(updateStateWithDates(surveyUnit)).toEqual([
      { type: surveyUnitStateEnum.VISIBLE_NOT_CLICKABLE.type, date: beforeCurrent },
      { type: surveyUnitStateEnum.VISIBLE_AND_CLICKABLE.type, date: NOW },
    ]);
  });
});

describe('isSelectable', () => {
  beforeAll(() => {
    vi.useFakeTimers('modern').setSystemTime(new Date(2021, 2, 15).getTime());
  });
  afterAll(() => {
    vi.useRealTimers();
  });
  it('should return false if date not in range', () => {
    const surveyUnitBefore = {
      identificationPhaseStartDate: new Date(2021, 1, 1).getTime(),
      endDate: new Date(2021, 1, 31).getTime(),
    };
    const surveyUnitAfter = {
      identificationPhaseStartDate: new Date(2021, 3, 1).getTime(),
      endDate: new Date(2021, 3, 31).getTime(),
    };
    expect(isSelectable(surveyUnitBefore)).toEqual(false);
    expect(isSelectable(surveyUnitAfter)).toEqual(false);
  });
  it('should return true if date in range', () => {
    const surveyUnitInRange = {
      identificationPhaseStartDate: new Date(2021, 2, 1).getTime(),
      endDate: new Date(2021, 3, 31).getTime(),
    };
    expect(isSelectable(surveyUnitInRange)).toEqual(true);
  });
});

describe('isQuestionnaireAvailable', () => {
  beforeAll(() => {
    vi.useFakeTimers('modern').setSystemTime(new Date(2021, 2, 15).getTime());
  });
  afterAll(() => {
    vi.useRealTimers();
  });
  const suInRange = {
    collectionStartDate: new Date(2021, 2, 1).getTime(),
    collectionEndDate: new Date(2021, 3, 1).getTime(),
  };
  const suBefore = {
    collectionStartDate: new Date(2021, 1, 1).getTime(),
    collectionEndDate: new Date(2021, 2, 1).getTime(),
  };
  const suAfter = {
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
  it('should return false if one argument is falsy', () => {
    expect(areCaEqual(undefined, undefined)).toEqual(false);
    expect(
      areCaEqual(undefined, {
        date: 1600000000000,
        status: contactAttemptEnum.APPOINTMENT_MADE.type,
      })
    ).toEqual(false);
    expect(
      areCaEqual(
        {
          date: 1600000000000,
          status: contactAttemptEnum.APPOINTMENT_MADE.type,
        },
        undefined
      )
    ).toEqual(false);
  });
  it('should return false if at least one attribute is different', () => {
    expect(
      areCaEqual(
        {
          date: 1600000000000,
          status: contactAttemptEnum.APPOINTMENT_MADE.type,
        },
        {
          date: 161000000000,
          status: contactAttemptEnum.APPOINTMENT_MADE.type,
        }
      )
    ).toEqual(false);
    expect(
      areCaEqual(
        {
          date: 1600000000000,
          status: contactAttemptEnum.APPOINTMENT_MADE.type,
        },
        {
          date: 160000000000,
          status: contactAttemptEnum.INTERVIEW_ACCEPTED.type,
        }
      )
    ).toEqual(false);
  });
  it('should return true if date and status are equal', () => {
    expect(
      areCaEqual(
        {
          date: 1600000000000,
          status: contactAttemptEnum.APPOINTMENT_MADE.type,
        },
        {
          date: 1600000000000,
          status: contactAttemptEnum.APPOINTMENT_MADE.type,
        }
      )
    ).toEqual(true);
  });
});

describe('lastContactAttemptIsSuccessfull', () => {
  it('should return false if no contactAttempts', () => {
    expect(lastContactAttemptIsSuccessfull({ contactAttempts: [] })).toEqual(false);
  });
  it('should return false if cas contains no successfull ca', () => {
    expect(
      lastContactAttemptIsSuccessfull({
        contactAttempts: [{ date: 1, status: contactAttemptEnum.NO_CONTACT.type }],
      })
    ).toEqual(false);
  });
  it('should return false if successfull ca is not last ca', () => {
    expect(
      lastContactAttemptIsSuccessfull({
        contactAttempts: [
          { date: 1, status: contactAttemptEnum.INTERVIEW_ACCEPTED.type },
          { date: 2, status: contactAttemptEnum.NO_CONTACT.type },
        ],
      })
    ).toEqual(false);
  });
  it('should return true if last ca is successfull', () => {
    expect(
      lastContactAttemptIsSuccessfull({
        contactAttempts: [
          { date: 1, status: contactAttemptEnum.NO_CONTACT.type },
          { date: 2, status: contactAttemptEnum.INTERVIEW_ACCEPTED.type },
        ],
      })
    ).toEqual(true);
  });
});
