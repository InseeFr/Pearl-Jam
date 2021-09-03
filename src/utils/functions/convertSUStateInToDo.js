import suStateEnum from 'utils/enum/SUStateEnum';
import toDoEnum from 'utils/enum/SUToDoEnum';

export const convertSUStateInToDo = suState => {
  if (
    [suStateEnum.VISIBLE_NOT_CLICKABLE.type, suStateEnum.VISIBLE_AND_CLICKABLE.type].includes(
      suState
    )
  ) {
    return toDoEnum.NOT_STARTED;
  }
  if ([suStateEnum.IN_PREPARATION.type, suStateEnum.AT_LEAST_ONE_CONTACT.type].includes(suState)) {
    return toDoEnum.CONTACT;
  }
  if (suState === suStateEnum.APPOINTMENT_MADE.type) {
    return toDoEnum.SURVEY;
  }
  if (suState === suStateEnum.QUESTIONNAIRE_STARTED.type) {
    return toDoEnum.FINALIZE;
  }
  if (suState === suStateEnum.WAITING_FOR_TRANSMISSION.type) {
    return toDoEnum.TRANSMIT;
  }
  if (suState === suStateEnum.WAITING_FOR_SYNCHRONIZATION.type) {
    return toDoEnum.SYNCHRONIZE;
  }
  if (
    [suStateEnum.TO_BE_REVIEWED.type, suStateEnum.FINALIZED.type, suStateEnum.CLOSED.type].includes(
      suState
    )
  ) {
    return toDoEnum.TERMINATED;
  }

  return false;
};
