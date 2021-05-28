const surveyUnitStateEnum = require('common-tools/enum/SUStateEnum');

const {
  getContactAttemptNumber,
  getLastState,
  isSelectable,
  updateStateWithDates,
} = require('common-tools/functions');

describe('getLastState', () => {
  it('should return the only state', () => {
    expect(getLastState({ states: [{ id: 1, date: 1616070963000 }] })).toEqual({
      id: 1,
      date: 1616070963000,
    });
  });
  it('should return false if empty states', () => {
    expect(getLastState({ states: [] })).toEqual(false);
  });
  it('should return state with latest date', () => {
    expect(
      getLastState({
        states: [
          { id: 1, date: 1616070963000 },
          { id: 2, date: 1616070000000 },
        ],
      })
    ).toEqual({
      id: 1,
      date: 1616070963000,
    });
  });
});

describe('getContactAttemptNumber', () => {
  it('should return 0 contacts attempts if no contactAttempts in states', async () => {
    const surveyUnit = { states: [] };
    const statesWithNoContactAttempt = [{ type: surveyUnitStateEnum.APPOINTMENT_MADE }];
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
    // expect(getContactAttemptNumber({ states: [...statesWithOneContactAttempt] })).toEqual(1);
    // expect(getContactAttemptNumber({ states: [...statesWithTwoContactAttempt] })).toEqual(2);
  });
});
describe('updateStateWithDates', () => {
  it('should return 0 is SU is VNC and currentDate>identificationPhaseStart', async () => {
    const surveyUnit = {};
    expect(updateStateWithDates(surveyUnit)).toEqual(0);
  });
});

describe('isSelectable', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern');
    // jest.setSystemTime(new Date('2021-2-15'));
  });
  afterAll(() => {
    jest.useRealTimers();
  });
  it('should return false if date not in range', () => {
    const surveyUnitBefore = {
      identificationPhaseStartDate: new Date(2021, 1, 1),
      endDate: new Date(2021, 1, 31),
    };
    const surveyUnitAfter = {
      identificationPhaseStartDate: new Date(2021, 3, 1),
      endDate: new Date(2021, 3, 31),
    };
    expect(isSelectable(surveyUnitBefore)).toEqual(false);
    expect(isSelectable(surveyUnitAfter)).toEqual(false);
  });
  it('should return true if date in range', () => {
    const surveyUnitInRange = {
      identificationPhaseStartDate: new Date(2021, 2, 1),
      endDate: new Date(2021, 3, 31),
    };
    expect(isSelectable(surveyUnitInRange)).toEqual(true);
  });
});
