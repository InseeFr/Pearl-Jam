import suStateEnum from 'common-tools/enum/SUStateEnum';
import toDoEnum from 'common-tools/enum/SUToDoEnum';

export const convertSUStateInToDo = suState => {
  if (suState === suStateEnum.NOT_STARTED.type) {
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
  return false;
};
