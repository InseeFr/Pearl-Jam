import { SurveyUnit, SurveyUnitState } from 'types/pearl';
import { CONTACT_RELATED_STATES } from 'utils/constants';
import { surveyUnitStateEnum, StateValues } from 'utils/enum/SUStateEnum';
import { convertSUStateInToDo } from './convertSUStateInToDo';
import { getContactAttemptNumber, isContactAttemptOk } from './surveyUnitFunctions';

/**
 * Extract the survey unit state
 *
 * @param {SurveyUnit} surveyUnit
 * @returns {{ order: string, value: string, color: string }}
 */
export const getSuTodoState = (surveyUnit: SurveyUnit) => {
  return convertSUStateInToDo(surveyUnit, getLastState(surveyUnit?.states ?? [])?.type);
};

/**
 * @param {SurveyUnitState[]} states
 * @returns {SurveyUnitState} or undefined if no states
 */
export const getLastState = (states: SurveyUnitState[]) => {
  return states?.slice?.().sort((a, b) => b.date - a.date)?.[0];
};

const addLatestState = (states: SurveyUnitState[], newState: SurveyUnitState) => {
  const newStates = states?.slice?.() ?? [];
  const previousLatestState = getLastState(newStates);

  const date = previousLatestState?.date;
  if (date && newState.date <= date) {
    newStates.push({ ...newState, date: date + 1 });
  } else {
    newStates.push(newState);
  }
  return newStates;
};

const copyStatesFromSurveyUnit = (surveyUnit: SurveyUnit) => surveyUnit?.states?.slice?.() ?? [];

/**
 * Add a contact-related state and ensures states cohesity
 *  => e.g. could add another state after or before newState
 * @param {*} surveyUnit
 * @param {{String: type, String: value}} newState SUStateEnum entry
 * @returns {Array.<{ type: string, value: string }>} updated states
 */
const addContactState = (surveyUnit: SurveyUnit, newState: SurveyUnitState) => {
  // shallow copy or new empty array
  let newStates = copyStatesFromSurveyUnit(surveyUnit);
  switch (newState.type) {
    case surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type:
      newStates = addLatestState(newStates, newState);
      if (isContactAttemptOk(surveyUnit)) {
        newStates = addLatestState(newStates, {
          date: Date.now(),
          type: surveyUnitStateEnum.APPOINTMENT_MADE.type,
        });
      }
      break;

    case surveyUnitStateEnum.APPOINTMENT_MADE.type:
      if (getContactAttemptNumber(surveyUnit) === 0) {
        newStates = addLatestState(newStates, {
          date: Date.now(),
          type: surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type,
        });
      }
      newStates = addLatestState(newStates, newState);
      break;
    default:
      break;
  }
  return newStates;
};

/** Add a new state to a surveyUnit, with state cohesion */
export const addNewState = (surveyUnit: SurveyUnit, stateType: StateValues) => {
  let newStates = copyStatesFromSurveyUnit(surveyUnit);
  const lastStateType = getLastState(newStates)?.type;
  const newState: SurveyUnitState = { date: Date.now(), type: stateType };
  newStates = handleStateTransition(surveyUnit, newStates, lastStateType, newState, stateType);
  return newStates;
};

export const handleStateTransition = (
  surveyUnit: SurveyUnit,
  states: SurveyUnitState[],
  lastStateType: string,
  newState: SurveyUnitState,
  stateType: StateValues
): SurveyUnitState[] => {
  const handler = STATE_TRANSITION_HANDLERS[lastStateType] || STATE_TRANSITION_HANDLERS.default;
  return handler(surveyUnit, states, newState, stateType);
};

export const handleQuestionnaireStarted = (
  surveyUnit: SurveyUnit,
  states: SurveyUnitState[],
  newState: SurveyUnitState,
  stateType: StateValues
): SurveyUnitState[] => {
  if (CONTACT_RELATED_STATES.includes(stateType)) {
    states = addContactState(surveyUnit, newState);
    states = addLatestState(states, {
      date: Date.now(),
      type: surveyUnitStateEnum.QUESTIONNAIRE_STARTED.type,
    });
  } else {
    states = addLatestState(states, newState);
  }
  return states;
};

export const handleAtLeastOneContact = (
  surveyUnit: SurveyUnit,
  states: SurveyUnitState[],
  newState: SurveyUnitState,
  stateType: StateValues
): SurveyUnitState[] => {
  if (stateType === surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type) {
    if (isContactAttemptOk(surveyUnit)) {
      return addLatestState(states, {
        date: Date.now(),
        type: surveyUnitStateEnum.APPOINTMENT_MADE.type,
      });
    }
    return states;
  }
  if (stateType === surveyUnitStateEnum.APPOINTMENT_MADE.type) {
    return addContactState(surveyUnit, newState);
  }
  return addLatestState(states, newState);
};

export const handleAppointmentMade = (
  surveyUnit: SurveyUnit,
  states: SurveyUnitState[],
  newState: SurveyUnitState,
  stateType: StateValues
): SurveyUnitState[] => {
  if (stateType === surveyUnitStateEnum.APPOINTMENT_MADE.type) {
    return states;
  }
  if (stateType === surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type) {
    return addContactState(surveyUnit, newState);
  }
  return addLatestState(states, newState);
};

export const handleTransmissionStates = (
  surveyUnit: SurveyUnit,
  states: SurveyUnitState[],
  newState: SurveyUnitState,
  stateType: StateValues
): SurveyUnitState[] => {
  if (CONTACT_RELATED_STATES.includes(stateType)) {
    states = addContactState(surveyUnit, newState);
    states = addLatestState(states, {
      date: Date.now(),
      type: surveyUnitStateEnum.WAITING_FOR_TRANSMISSION.type,
    });
  } else {
    states = addLatestState(states, newState);
  }
  return states;
};

export const handleInitialStates = (
  surveyUnit: SurveyUnit,
  states: SurveyUnitState[],
  newState: SurveyUnitState,
  stateType: StateValues
): SurveyUnitState[] => {
  if (CONTACT_RELATED_STATES.includes(stateType)) {
    return addContactState(surveyUnit, newState);
  }
  return addLatestState(states, newState);
};

type StateHandler = (
  surveyUnit: SurveyUnit,
  states: SurveyUnitState[],
  newState: SurveyUnitState,
  stateType: StateValues
) => SurveyUnitState[];
const STATE_TRANSITION_HANDLERS: Record<string, StateHandler> = {
  [surveyUnitStateEnum.QUESTIONNAIRE_STARTED.type]: handleQuestionnaireStarted,
  [surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type]: handleAtLeastOneContact,
  [surveyUnitStateEnum.APPOINTMENT_MADE.type]: handleAppointmentMade,
  [surveyUnitStateEnum.WAITING_FOR_TRANSMISSION.type]: handleTransmissionStates,
  [surveyUnitStateEnum.WAITING_FOR_SYNCHRONIZATION.type]: handleTransmissionStates,
  [surveyUnitStateEnum.TO_BE_REVIEWED.type]: handleTransmissionStates,
  [surveyUnitStateEnum.FINALIZED.type]: handleTransmissionStates,
  [surveyUnitStateEnum.IN_PREPARATION.type]: handleInitialStates,
  [surveyUnitStateEnum.VISIBLE_NOT_CLICKABLE.type]: handleInitialStates,
  [surveyUnitStateEnum.VISIBLE_AND_CLICKABLE.type]: handleInitialStates,
  default: handleInitialStates,
};

/**
 * Check if a surveyUnit meets criteria to update state from
 *  VIN to VIC (lastState is VIN and identificationStartDate has passed)
 * @param {*} surveyUnit
 * @returns {[]} newStates
 */
export const updateStateWithDates = (surveyUnit: SurveyUnit) => {
  let newStates = copyStatesFromSurveyUnit(surveyUnit);
  const lastState = getLastState(newStates)?.type;
  const currentDate = Date.now();
  const { identificationPhaseStartDate } = surveyUnit;

  if (
    lastState === surveyUnitStateEnum.VISIBLE_NOT_CLICKABLE.type &&
    currentDate > identificationPhaseStartDate
  ) {
    newStates = addNewState(surveyUnit, surveyUnitStateEnum.VISIBLE_AND_CLICKABLE.type);
  }

  return newStates;
};
