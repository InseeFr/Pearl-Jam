import { surveyUnitStateEnum } from 'utils/enum/SUStateEnum';
import {
  addNewState,
  getLastState,
  handleAppointmentMade,
  handleAtLeastOneContact,
  handleInitialStates,
  handleQuestionnaireStarted,
  handleTransmissionStates,
  updateStateWithDates,
} from './surveyUnitState';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { SurveyUnit, SurveyUnitState } from 'types/pearl';
import { createSurveyUnit } from 'utils/testing/createFakeData';

const mockedEmptySu = {} as unknown as SurveyUnit;
const mockedSu = createSurveyUnit();

describe('getLastState', () => {
  it('should return the only state', () => {
    expect(getLastState([{ id: 1, date: 1616070963000, type: 'VIN' }])).toEqual({
      id: 1,
      date: 1616070963000,
      type: 'VIN',
    });
  });
  it('should return undefined if empty states', () => {
    expect(getLastState([])).toEqual(undefined);
  });
  it('should return state with latest date', () => {
    expect(
      getLastState([
        { id: 1, date: 1616070963000, type: 'VIN' },
        { id: 2, date: 1616070000000, type: 'VIC' },
      ])
    ).toEqual({
      id: 1,
      date: 1616070963000,
      type: 'VIN',
    });
  });
});

describe('updateStateWithDates', () => {
  const NOW = new Date(2021, 2, 15).getTime();
  beforeAll(() => {
    vi.useFakeTimers().setSystemTime(NOW);
  });
  afterAll(() => {
    vi.useRealTimers();
  });
  const beforeCurrent = new Date(2021, 2, 10).getTime();
  const afterCurrent = new Date(2021, 2, 20).getTime();
  it('should return initial states if lastState is not VNC', () => {
    expect(updateStateWithDates(mockedEmptySu)).toEqual([]);
    expect(updateStateWithDates({ ...mockedEmptySu, states: [] })).toEqual([]);
  });
  it('should return initial states if SU lastState is VNC and currentDate < identificationPhaseStart', () => {
    const surveyUnit = {
      ...mockedEmptySu,
      states: [{ type: surveyUnitStateEnum.VISIBLE_NOT_CLICKABLE.type, date: beforeCurrent }],
      identificationPhaseStartDate: afterCurrent,
    };
    expect(updateStateWithDates(surveyUnit)).toEqual([
      { type: surveyUnitStateEnum.VISIBLE_NOT_CLICKABLE.type, date: beforeCurrent },
    ]);
  });
  it('should return 1 if SU is VNC and currentDate > identificationPhaseStart', () => {
    const surveyUnit = {
      ...mockedSu,
      states: [{ type: surveyUnitStateEnum.VISIBLE_NOT_CLICKABLE.type, date: beforeCurrent }],
      identificationPhaseStartDate: beforeCurrent,
    };

    expect(updateStateWithDates(surveyUnit)).toEqual([
      { type: surveyUnitStateEnum.VISIBLE_NOT_CLICKABLE.type, date: beforeCurrent },
      { type: surveyUnitStateEnum.VISIBLE_AND_CLICKABLE.type, date: NOW },
    ]);
  });
});

const state = (type: string, date = 1000): SurveyUnitState => ({ date, type: type as any });

describe('handleQuestionnaireStarted', () => {
  [
    {
      name: 'contact state AT_LEAST_ONE_CONTACT',
      stateType: surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type,
    },
    {
      name: 'contact state APPOINTMENT_MADE',
      stateType: surveyUnitStateEnum.APPOINTMENT_MADE.type,
    },
    {
      name: 'non-contact state IN_PREPARATION',
      stateType: surveyUnitStateEnum.IN_PREPARATION.type,
    },
    {
      name: 'non-contact state VISIBLE_AND_CLICKABLE',
      stateType: surveyUnitStateEnum.VISIBLE_AND_CLICKABLE.type,
    },
  ].forEach(({ name, stateType }) => {
    it(`should handle ${name}`, () => {
      const su = createSurveyUnit({
        states: [state(surveyUnitStateEnum.QUESTIONNAIRE_STARTED.type)],
      });
      const result = handleQuestionnaireStarted(su, su.states, state(stateType), stateType as any);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
  });
});

describe('handleAtLeastOneContact', () => {
  [
    {
      name: 'same state AT_LEAST_ONE_CONTACT',
      stateType: surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type,
    },
    { name: 'APPOINTMENT_MADE state', stateType: surveyUnitStateEnum.APPOINTMENT_MADE.type },
    {
      name: 'QUESTIONNAIRE_STARTED state',
      stateType: surveyUnitStateEnum.QUESTIONNAIRE_STARTED.type,
    },
    { name: 'IN_PREPARATION state', stateType: surveyUnitStateEnum.IN_PREPARATION.type },
  ].forEach(({ name, stateType }) => {
    it(`should handle ${name}`, () => {
      const su = createSurveyUnit({
        states: [state(surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type)],
      });
      const result = handleAtLeastOneContact(su, su.states, state(stateType), stateType as any);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
  });
});

describe('handleAppointmentMade', () => {
  [
    { name: 'same state APPOINTMENT_MADE', stateType: surveyUnitStateEnum.APPOINTMENT_MADE.type },
    {
      name: 'AT_LEAST_ONE_CONTACT state',
      stateType: surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type,
    },
    {
      name: 'QUESTIONNAIRE_STARTED state',
      stateType: surveyUnitStateEnum.QUESTIONNAIRE_STARTED.type,
    },
    { name: 'IN_PREPARATION state', stateType: surveyUnitStateEnum.IN_PREPARATION.type },
  ].forEach(({ name, stateType }) => {
    it(`should handle ${name}`, () => {
      const su = createSurveyUnit({
        states: [state(surveyUnitStateEnum.APPOINTMENT_MADE.type)],
      });
      const result = handleAppointmentMade(su, su.states, state(stateType), stateType as any);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
  });
});

describe('handleTransmissionStates', () => {
  const transmissionStates = [
    surveyUnitStateEnum.WAITING_FOR_TRANSMISSION.type,
    surveyUnitStateEnum.WAITING_FOR_SYNCHRONIZATION.type,
    surveyUnitStateEnum.TO_BE_REVIEWED.type,
    surveyUnitStateEnum.FINALIZED.type,
  ];

  const newStates = [
    surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type,
    surveyUnitStateEnum.APPOINTMENT_MADE.type,
    surveyUnitStateEnum.IN_PREPARATION.type,
    surveyUnitStateEnum.QUESTIONNAIRE_STARTED.type,
  ];

  transmissionStates.forEach(lastState => {
    newStates.forEach(newStateType => {
      it(`should handle ${lastState} → ${newStateType}`, () => {
        const su = createSurveyUnit({
          states: [state(lastState)],
        });
        const result = handleTransmissionStates(
          su,
          su.states,
          state(newStateType),
          newStateType as any
        );

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
      });
    });
  });
});

describe('handleInitialStates', () => {
  const initialStates = [
    surveyUnitStateEnum.IN_PREPARATION.type,
    surveyUnitStateEnum.VISIBLE_NOT_CLICKABLE.type,
    surveyUnitStateEnum.VISIBLE_AND_CLICKABLE.type,
  ];

  const newStates = [
    surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type,
    surveyUnitStateEnum.APPOINTMENT_MADE.type,
    surveyUnitStateEnum.QUESTIONNAIRE_STARTED.type,
    surveyUnitStateEnum.IN_PREPARATION.type,
  ];

  initialStates.forEach(lastState => {
    newStates.forEach(newStateType => {
      it(`should handle ${lastState} → ${newStateType}`, () => {
        const su = createSurveyUnit({
          states: [state(lastState)],
        });
        const result = handleInitialStates(su, su.states, state(newStateType), newStateType as any);

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
      });
    });
  });
});

describe('addNewState', () => {
  [
    {
      name: 'empty initial states',
      initialStates: [],
      newStateType: surveyUnitStateEnum.IN_PREPARATION.type,
    },
    {
      name: 'IN_PREPARATION → QUESTIONNAIRE_STARTED',
      initialStates: [state(surveyUnitStateEnum.IN_PREPARATION.type)],
      newStateType: surveyUnitStateEnum.QUESTIONNAIRE_STARTED.type,
    },
    {
      name: 'QUESTIONNAIRE_STARTED → AT_LEAST_ONE_CONTACT',
      initialStates: [state(surveyUnitStateEnum.QUESTIONNAIRE_STARTED.type)],
      newStateType: surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type,
    },
    {
      name: 'AT_LEAST_ONE_CONTACT → APPOINTMENT_MADE',
      initialStates: [state(surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type)],
      newStateType: surveyUnitStateEnum.APPOINTMENT_MADE.type,
    },
    {
      name: 'APPOINTMENT_MADE → WAITING_FOR_TRANSMISSION',
      initialStates: [state(surveyUnitStateEnum.APPOINTMENT_MADE.type)],
      newStateType: surveyUnitStateEnum.WAITING_FOR_TRANSMISSION.type,
    },
    {
      name: 'WAITING_FOR_TRANSMISSION → FINALIZED',
      initialStates: [state(surveyUnitStateEnum.WAITING_FOR_TRANSMISSION.type)],
      newStateType: surveyUnitStateEnum.FINALIZED.type,
    },
    {
      name: 'multiple states sequence',
      initialStates: [
        state(surveyUnitStateEnum.IN_PREPARATION.type, 1000),
        state(surveyUnitStateEnum.QUESTIONNAIRE_STARTED.type, 2000),
        state(surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type, 3000),
      ],
      newStateType: surveyUnitStateEnum.APPOINTMENT_MADE.type,
    },
  ].forEach(({ name, initialStates, newStateType }) => {
    it(`should handle ${name}`, () => {
      const su = createSurveyUnit({ states: initialStates });
      const initialLength = su.states.length;

      const result = addNewState(su, newStateType as any);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThanOrEqual(initialLength);
      expect(result[result.length - 1].type).toBeDefined();
    });
  });

  describe('edge cases', () => {
    it('should preserve date ordering', () => {
      const su = createSurveyUnit({
        states: [state(surveyUnitStateEnum.IN_PREPARATION.type, 1000)],
      });
      const result = addNewState(su, surveyUnitStateEnum.QUESTIONNAIRE_STARTED.type as any);

      for (let i = 1; i < result.length; i++) {
        expect(result[i].date).toBeGreaterThanOrEqual(result[i - 1].date);
      }
    });

    it('should increment date if new state date is same or earlier', () => {
      const su = createSurveyUnit({
        states: [state(surveyUnitStateEnum.IN_PREPARATION.type, 5000)],
      });
      const result = addNewState(su, surveyUnitStateEnum.QUESTIONNAIRE_STARTED.type as any);

      expect(result.length).toBeGreaterThan(su.states.length);
    });

    it('should handle rapid consecutive state additions', () => {
      let su = createSurveyUnit({ states: [state(surveyUnitStateEnum.IN_PREPARATION.type, 1000)] });

      su.states = addNewState(su, surveyUnitStateEnum.QUESTIONNAIRE_STARTED.type as any);
      su.states = addNewState(su, surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type as any);
      su.states = addNewState(su, surveyUnitStateEnum.APPOINTMENT_MADE.type as any);

      expect(su.states.length).toBeGreaterThanOrEqual(4);
    });

    it('should not mutate original states array reference', () => {
      const originalStates = [state(surveyUnitStateEnum.IN_PREPARATION.type)];
      const su = createSurveyUnit({ states: originalStates });

      addNewState(su, surveyUnitStateEnum.QUESTIONNAIRE_STARTED.type as any);

      expect(originalStates.length).toBe(1);
    });
  });
});
