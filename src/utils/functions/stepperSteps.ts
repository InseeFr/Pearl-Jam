import { OtherModeQuestionStateType, SurveyUnit } from 'types/pearl';
import { StateValues, surveyUnitStateEnum } from 'utils/enum/SUStateEnum';
import { toDoEnum, ToDoEnumValues } from 'utils/enum/SUToDoEnum';

type ToDoKey = keyof typeof toDoEnum;

/**
 * Maximum order displayed in the survey unit header stepper
 */
const MAX_STEPPER_ORDER = 6;

const hasOtherModeState = (surveyUnit: SurveyUnit, state: OtherModeQuestionStateType) =>
  !!surveyUnit.otherModeQuestionnaireState?.some(o => o.state === state);

const hasState = (surveyUnit: SurveyUnit, type: StateValues) =>
  !!surveyUnit.states?.some(state => state.type === type);

/**
 * Rules describing which steps are not relevant for a survey unit :
 * when `when` matches, every step listed in `hide` is removed from the stepper.
 */
const stepperRules: { hide: ToDoKey[]; when: (surveyUnit: SurveyUnit) => boolean }[] = [
  {
    // No web questionnaire, or it has been taken back by the interviewer : no web step
    hide: ['WEBFINALIZE'],
    when: surveyUnit =>
      !surveyUnit.otherModeQuestionnaireState?.length ||
      hasOtherModeState(surveyUnit, 'MULTIMODE_MOVED') ||
      hasState(surveyUnit, surveyUnitStateEnum.REGAINED_CONTROL_INTERVIEW.type),
  },
  {
    // Questionnaire going on web (not terminated) : only preparation, then web finalization
    hide: ['CONTACT', 'SURVEY', 'FINALIZE'],
    when: surveyUnit =>
      hasOtherModeState(surveyUnit, 'QUESTIONNAIRE_INIT') &&
      !hasOtherModeState(surveyUnit, 'QUESTIONNAIRE_COMPLETED') &&
      !hasOtherModeState(surveyUnit, 'QUESTIONNAIRE_VALIDATED') &&
      !hasOtherModeState(surveyUnit, 'MULTIMODE_MOVED') &&
      !hasState(surveyUnit, surveyUnitStateEnum.REGAINED_CONTROL_INTERVIEW.type),
  },
];

/**
 * Return the ordered steps to display in the survey unit header stepper
 */
export const getStepperSteps = (surveyUnit: SurveyUnit): ToDoEnumValues[] => {
  const hidden = new Set(
    stepperRules.filter(rule => rule.when(surveyUnit)).flatMap(rule => rule.hide)
  );

  return (Object.entries(toDoEnum) as [ToDoKey, ToDoEnumValues][])
    .filter(([key, toDo]) => Number(toDo.order) < MAX_STEPPER_ORDER && !hidden.has(key))
    .map(([, toDo]) => toDo);
};
