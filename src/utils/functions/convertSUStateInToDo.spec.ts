import { describe, it, expect } from 'vitest';
import { convertSUStateInToDo } from './convertSUStateInToDo';
import { toDoEnum } from 'utils/enum/SUToDoEnum';
import { surveyUnitStateEnum, TypeValues } from 'utils/enum/SUStateEnum';

describe('convertSUStateInToDo', () => {
  it('should return NOT_STARTED for VISIBLE_NOT_CLICKABLE and VISIBLE_AND_CLICKABLE', () => {
    expect(convertSUStateInToDo(surveyUnitStateEnum.VISIBLE_NOT_CLICKABLE.type)).toBe(
      toDoEnum.NOT_STARTED
    );
    expect(convertSUStateInToDo(surveyUnitStateEnum.VISIBLE_AND_CLICKABLE.type)).toBe(
      toDoEnum.NOT_STARTED
    );
  });

  it('should return CONTACT for IN_PREPARATION and AT_LEAST_ONE_CONTACT', () => {
    expect(convertSUStateInToDo(surveyUnitStateEnum.IN_PREPARATION.type)).toBe(toDoEnum.CONTACT);
    expect(convertSUStateInToDo(surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type)).toBe(
      toDoEnum.CONTACT
    );
  });

  it('should return SURVEY for APPOINTMENT_MADE', () => {
    expect(convertSUStateInToDo(surveyUnitStateEnum.APPOINTMENT_MADE.type)).toBe(toDoEnum.SURVEY);
  });

  it('should return FINALIZE for QUESTIONNAIRE_STARTED', () => {
    expect(convertSUStateInToDo(surveyUnitStateEnum.QUESTIONNAIRE_STARTED.type)).toBe(
      toDoEnum.FINALIZE
    );
  });

  it('should return TRANSMIT for WAITING_FOR_TRANSMISSION', () => {
    expect(convertSUStateInToDo(surveyUnitStateEnum.WAITING_FOR_TRANSMISSION.type)).toBe(
      toDoEnum.TRANSMIT
    );
  });

  it('should return SYNCHRONIZE for WAITING_FOR_SYNCHRONIZATION', () => {
    expect(convertSUStateInToDo(surveyUnitStateEnum.WAITING_FOR_SYNCHRONIZATION.type)).toBe(
      toDoEnum.SYNCHRONIZE
    );
  });

  it('should return TERMINATED for TO_BE_REVIEWED, FINALIZED, and CLOSED', () => {
    expect(convertSUStateInToDo(surveyUnitStateEnum.TO_BE_REVIEWED.type)).toBe(toDoEnum.TERMINATED);
    expect(convertSUStateInToDo(surveyUnitStateEnum.FINALIZED.type)).toBe(toDoEnum.TERMINATED);
    expect(convertSUStateInToDo(surveyUnitStateEnum.CLOSED.type)).toBe(toDoEnum.TERMINATED);
  });

  it('should return undefined for an unknown state', () => {
    expect(convertSUStateInToDo('UNKNOWN_STATE' as unknown as TypeValues)).toBeUndefined();
  });
});
