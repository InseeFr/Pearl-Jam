import { surveyUnitStateEnum } from 'utils/enum/SUStateEnum';
import toDoEnum from 'utils/enum/SUToDoEnum';

export const convertSUStateInToDo = suState => {
  if (
    [
      surveyUnitStateEnum.VISIBLE_NOT_CLICKABLE.type,
      surveyUnitStateEnum.VISIBLE_AND_CLICKABLE.type,
    ].includes(suState)
  ) {
    return toDoEnum.NOT_STARTED;
  }
  if (
    [
      surveyUnitStateEnum.IN_PREPARATION.type,
      surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type,
    ].includes(suState)
  ) {
    return toDoEnum.CONTACT;
  }
  if (suState === surveyUnitStateEnum.APPOINTMENT_MADE.type) {
    return toDoEnum.SURVEY;
  }
  if (suState === surveyUnitStateEnum.QUESTIONNAIRE_STARTED.type) {
    return toDoEnum.FINALIZE;
  }
  if (suState === surveyUnitStateEnum.WAITING_FOR_TRANSMISSION.type) {
    return toDoEnum.TRANSMIT;
  }
  if (suState === surveyUnitStateEnum.WAITING_FOR_SYNCHRONIZATION.type) {
    return toDoEnum.SYNCHRONIZE;
  }
  if (
    [
      surveyUnitStateEnum.TO_BE_REVIEWED.type,
      surveyUnitStateEnum.FINALIZED.type,
      surveyUnitStateEnum.CLOSED.type,
    ].includes(suState)
  ) {
    return toDoEnum.TERMINATED;
  }

  return false;
};
