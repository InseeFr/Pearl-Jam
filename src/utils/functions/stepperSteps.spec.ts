import { describe, expect, it } from 'vitest';
import { SurveyUnit } from 'types/pearl';
import { toDoEnum } from 'utils/enum/SUToDoEnum';
import { getStepperSteps, isStepDone } from './stepperSteps';

const buildSurveyUnit = (partial: Partial<SurveyUnit>) =>
  ({ states: [], otherModeQuestionnaireState: [], ...partial }) as unknown as SurveyUnit;

describe('getStepperSteps', () => {
  it('hides the web step when there is no other mode questionnaire', () => {
    expect(getStepperSteps(buildSurveyUnit({}))).toEqual([
      toDoEnum.NOT_STARTED,
      toDoEnum.CONTACT,
      toDoEnum.SURVEY,
      toDoEnum.FINALIZE,
      toDoEnum.TRANSMIT,
    ]);
  });

  it('only keeps preparation and web steps when a web questionnaire is in progress', () => {
    const surveyUnit = buildSurveyUnit({
      otherModeQuestionnaireState: [{ id: '1', state: 'QUESTIONNAIRE_INIT', date: '2025-01-01' }],
    });
    expect(getStepperSteps(surveyUnit)).toEqual([toDoEnum.NOT_STARTED, toDoEnum.WEBFINALIZE]);
  });

  it.each(['QUESTIONNAIRE_COMPLETED', 'QUESTIONNAIRE_VALIDATED'] as const)(
    'only keeps preparation and web steps when the web questionnaire is %s',
    state => {
      const surveyUnit = buildSurveyUnit({
        otherModeQuestionnaireState: [
          { id: '1', state: 'QUESTIONNAIRE_INIT', date: '2025-01-01' },
          { id: '2', state, date: '2025-01-02' },
        ],
      });
      expect(getStepperSteps(surveyUnit)).toEqual([
        toDoEnum.NOT_STARTED,
        toDoEnum.WEBFINALIZE,
        toDoEnum.WEBTERMINATED,
      ]);
    }
  );

  it('keeps the interviewer steps when the web questionnaire is completed but the survey unit moved', () => {
    const surveyUnit = buildSurveyUnit({
      otherModeQuestionnaireState: [
        { id: '1', state: 'QUESTIONNAIRE_COMPLETED', date: '2025-01-01' },
        { id: '2', state: 'MULTIMODE_MOVED', date: '2025-01-02' },
      ],
    });
    expect(getStepperSteps(surveyUnit)).toEqual([
      toDoEnum.NOT_STARTED,
      toDoEnum.CONTACT,
      toDoEnum.SURVEY,
      toDoEnum.FINALIZE,
      toDoEnum.TRANSMIT,
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

describe('isStepDone', () => {
  it('marks previous steps as done', () => {
    expect(isStepDone(toDoEnum.NOT_STARTED, toDoEnum.WEBFINALIZE)).toBe(true);
    expect(isStepDone(toDoEnum.TRANSMIT, toDoEnum.WEBFINALIZE)).toBe(false);
  });

  it('marks the current step as done only when it is a final step', () => {
    expect(isStepDone(toDoEnum.WEBFINALIZE, toDoEnum.WEBFINALIZE)).toBe(false);
    expect(isStepDone(toDoEnum.WEBTERMINATED, toDoEnum.WEBTERMINATED)).toBe(true);
  });

  it('marks nothing as done without current step', () => {
    expect(isStepDone(toDoEnum.NOT_STARTED, undefined)).toBe(false);
  });
});
