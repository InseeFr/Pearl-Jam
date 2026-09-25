import { OtherModeQuestionStateType, SurveyUnit } from 'types/pearl';
import { StateValues, surveyUnitStateEnum } from 'utils/enum/SUStateEnum';
import { toDoEnum, ToDoEnumValues } from 'utils/enum/SUToDoEnum';

type ToDoKey = keyof typeof toDoEnum;

/**
 * Last step displayed in the survey unit header stepper (following ones are not shown)
 */
const LAST_STEPPER_ORDER = Number(toDoEnum.TRANSMIT.order);

/**
 * Final steps : nothing left to do once reached, so they are displayed as done
 */
const FINAL_STEPS: ToDoEnumValues[] = [toDoEnum.TERMINATED, toDoEnum.WEBTERMINATED];

const hasOtherModeState = (surveyUnit: SurveyUnit, state: OtherModeQuestionStateType) =>
  !!surveyUnit.otherModeQuestionnaireState?.some(o => o.state === state);

const hasState = (surveyUnit: SurveyUnit, type: StateValues) =>
  !!surveyUnit.states?.some(state => state.type === type);

const isWebQuestionnaireTerminated = (surveyUnit: SurveyUnit) =>
  hasOtherModeState(surveyUnit, 'QUESTIONNAIRE_COMPLETED') ||
  hasOtherModeState(surveyUnit, 'QUESTIONNAIRE_VALIDATED');

/**
 * Rules adapting the stepper to a survey unit :
 * when `when` matches, every step listed in `hide` is removed from the stepper,
 * and every step listed in `show` is added even if it is after the last stepper step.
 */
const stepperRules: {
  hide?: ToDoKey[];
  show?: ToDoKey[];
  when: (surveyUnit: SurveyUnit) => boolean;
}[] = [
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
    hide: ['CONTACT', 'SURVEY', 'FINALIZE', 'TRANSMIT'],
    when: surveyUnit =>
      hasOtherModeState(surveyUnit, 'QUESTIONNAIRE_INIT') &&
      !isWebQuestionnaireTerminated(surveyUnit) &&
      !hasOtherModeState(surveyUnit, 'MULTIMODE_MOVED') &&
      !hasState(surveyUnit, surveyUnitStateEnum.REGAINED_CONTROL_INTERVIEW.type),
  },
  {
    // Questionnaire terminated on web : preparation, web finalization, then web termination
    hide: ['CONTACT', 'SURVEY', 'FINALIZE', 'TRANSMIT'],
    show: ['WEBTERMINATED'],
    when: surveyUnit =>
      isWebQuestionnaireTerminated(surveyUnit) &&
      !hasOtherModeState(surveyUnit, 'MULTIMODE_MOVED'),
  },
];

/**
 * Return the ordered steps to display in the survey unit header stepper
 */
export const getStepperSteps = (surveyUnit: SurveyUnit): ToDoEnumValues[] => {
  const matchingRules = stepperRules.filter(rule => rule.when(surveyUnit));
  const hidden = new Set(matchingRules.flatMap(rule => rule.hide ?? []));
  const shown = new Set(matchingRules.flatMap(rule => rule.show ?? []));

  return (Object.entries(toDoEnum) as [ToDoKey, ToDoEnumValues][])
    .filter(
      ([key, toDo]) =>
        (Number(toDo.order) <= LAST_STEPPER_ORDER || shown.has(key)) && !hidden.has(key)
    )
    .map(([, toDo]) => toDo);
};

/**
 * A step is done when the survey unit is past it, or when it is the reached final step
 */
export const isStepDone = (step: ToDoEnumValues, currentToDo?: ToDoEnumValues) => {
  if (!currentToDo) return false;
  if (step === currentToDo) return FINAL_STEPS.includes(step);
  return Number(step.order) < Number(currentToDo.order);
};
