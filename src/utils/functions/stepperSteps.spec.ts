import { describe, expect, it } from 'vitest';
import { SurveyUnit } from 'types/pearl';
import { toDoEnum } from 'utils/enum/SUToDoEnum';
import { getStepperSteps } from './stepperSteps';

const buildSurveyUnit = (partial: Partial<SurveyUnit>) =>
  ({ states: [], otherModeQuestionnaireState: [], ...partial }) as unknown as SurveyUnit;

describe('getStepperSteps', () => {
  it('hides the web step when there is no other mode questionnaire', () => {
    expect(getStepperSteps(buildSurveyUnit({}))).toEqual([
      toDoEnum.NOT_STARTED,
      toDoEnum.CONTACT,
      toDoEnum.SURVEY,
      toDoEnum.FINALIZE,
    ]);
  });

  it('only keeps preparation and web steps when a web questionnaire is in progress', () => {
    const surveyUnit = buildSurveyUnit({
      otherModeQuestionnaireState: [{ id: '1', state: 'QUESTIONNAIRE_INIT', date: '2025-01-01' }],
    });
    expect(getStepperSteps(surveyUnit)).toEqual([toDoEnum.NOT_STARTED, toDoEnum.WEBFINALIZE]);
  });

  it('keeps the interviewer steps when the web questionnaire is completed', () => {
    const surveyUnit = buildSurveyUnit({
      otherModeQuestionnaireState: [
        { id: '1', state: 'QUESTIONNAIRE_INIT', date: '2025-01-01' },
        { id: '2', state: 'QUESTIONNAIRE_COMPLETED', date: '2025-01-02' },
      ],
    });
    expect(getStepperSteps(surveyUnit)).toEqual([
      toDoEnum.NOT_STARTED,
      toDoEnum.CONTACT,
      toDoEnum.SURVEY,
      toDoEnum.FINALIZE,
      toDoEnum.WEBFINALIZE,
    ]);
  });

  it('hides the web step when the survey unit moved', () => {
    const surveyUnit = buildSurveyUnit({
      otherModeQuestionnaireState: [
        { id: '1', state: 'QUESTIONNAIRE_INIT', date: '2025-01-01' },
        { id: '2', state: 'MULTIMODE_MOVED', date: '2025-01-02' },
      ],
    });
    expect(getStepperSteps(surveyUnit)).not.toContain(toDoEnum.WEBFINALIZE);
  });

  it('hides the web step when the interviewer regained control', () => {
    const surveyUnit = buildSurveyUnit({
      states: [{ date: 1, type: 'RCI' }],
      otherModeQuestionnaireState: [{ id: '1', state: 'QUESTIONNAIRE_INIT', date: '2025-01-01' }],
    });
    expect(getStepperSteps(surveyUnit)).not.toContain(toDoEnum.WEBFINALIZE);
  });
});
