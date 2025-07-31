import { SurveyUnit } from 'types/pearl';
import { surveyUnitStateEnum, StateValues } from 'utils/enum/SUStateEnum';
import { toDoEnum } from 'utils/enum/SUToDoEnum';

export const convertSUStateInToDo = (surveyUnit: SurveyUnit, suState: StateValues) => {
  if (surveyUnit.otherModeQuestionnaireState?.find(o => o.state === 'QUESTIONNAIRE_COMPLETED')) {
    return toDoEnum.WEBTERMINATED;
  }

  if (
    surveyUnitStateEnum.VISIBLE_NOT_CLICKABLE.type === suState ||
    surveyUnitStateEnum.VISIBLE_AND_CLICKABLE.type === suState
  ) {
    return toDoEnum.NOT_STARTED;
  }
  if (
    surveyUnitStateEnum.IN_PREPARATION.type === suState ||
    surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type === suState
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

  return undefined;
};
