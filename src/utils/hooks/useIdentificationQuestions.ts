import { useCallback, useState } from 'react';
import { IdentificationQuestionsId } from 'utils/enum/identifications/IdentificationsQuestions';
import { SurveyUnit, SurveyUnitIdentification } from 'types/pearl';
import { surveyUnitStateEnum } from 'utils/enum/SUStateEnum';
import { addNewState, persistSurveyUnit } from 'utils/functions';
import {
  checkAvailability,
  isIdentificationFinished,
  IdentificationQuestionOption,
  IdentificationQuestions,
  getIdentificationQuestionsTree,
  ResponseState,
} from 'utils/functions/identifications/identificationFunctions';
import { useEffectOnce } from './useEffectOnce';

const generateResponseState = (
  questions: IdentificationQuestions,
  identification?: SurveyUnitIdentification
): ResponseState =>
  Object.fromEntries(
    Object.entries(questions.values).map(([id, { options }]) => [
      id,
      options.find(o => o.value === identification?.[id as IdentificationQuestionsId]),
    ])
  );

export function useIdentificationQuestions(surveyUnit: SurveyUnit) {
  const [questions, setQuestions] = useState<IdentificationQuestions>({ values: {} });
  const [responses, setResponses] = useState<ResponseState>({});
  const [availableQuestions, setAvailableQuestions] = useState<
    Partial<Record<IdentificationQuestionsId, boolean>>
  >({});
  const [selectedDialogId, setSelectedDialogId] = useState<IdentificationQuestionsId | undefined>(
    undefined
  );

  const setNextDialogId = (
    questions: IdentificationQuestions,
    dialogId?: IdentificationQuestionsId
  ) => {
    if (!dialogId || !questions.values[dialogId]?.disabled) return dialogId;

    const nextId = questions.values[dialogId].nextId;
    return setNextDialogId(questions, nextId);
  };

  useEffectOnce(() => {
    console.log('useEffectOnce');

    let identification = surveyUnit.identification ?? {};
    if (selectedDialogId && identification[selectedDialogId])
      identification[selectedDialogId] = undefined;

    const newQuestions = getIdentificationQuestionsTree(
      surveyUnit.identificationConfiguration,
      surveyUnit.identification
    );

    setQuestions(newQuestions);

    const newResponses = generateResponseState(newQuestions, surveyUnit.identification);

    const newAvailability: Partial<Record<IdentificationQuestionsId, boolean>> = Object.fromEntries(
      Object.entries(newQuestions.values).map(([questionId, question]) => [
        questionId,
        checkAvailability(newQuestions.values, question, newResponses),
      ])
    );

    setAvailableQuestions(newAvailability);
    setResponses(newResponses);
  }, [surveyUnit.id]);

  const handleResponse = (
    selectedQuestionId: IdentificationQuestionsId,
    option: IdentificationQuestionOption
  ) => {
    let updatedResponses: ResponseState = {
      ...responses,
      [selectedQuestionId]: option,
    };
    let identification: SurveyUnitIdentification = surveyUnit.identification ?? {};
    identification[selectedQuestionId] = option.value;

    const newQuestions = getIdentificationQuestionsTree(
      surveyUnit.identificationConfiguration,
      identification
    );

    const newResponses = generateResponseState(newQuestions, identification);

    let setResponsesAsUndefined = false;

    const newAvailability: Partial<Record<IdentificationQuestionsId, boolean>> = Object.fromEntries(
      Object.entries(newQuestions.values).map(([questionId, question]) => {
        const available = checkAvailability(newQuestions.values, question, newResponses);

        if (!available || setResponsesAsUndefined) updatedResponses[question.id] = undefined;
        else if (questionId === selectedQuestionId) {
          updatedResponses[question.id] = option;
          setResponsesAsUndefined = true;
        }

        if (!available) identification[questionId as IdentificationQuestionsId] = undefined;

        return [questionId, available];
      })
    );

    let newStates = surveyUnit.states;
    if (isIdentificationFinished(surveyUnit.identificationConfiguration, identification))
      newStates = addNewState(surveyUnit, surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type);

    console.log('newAvailability', newAvailability);

    persistSurveyUnit({
      ...surveyUnit,
      states: newStates,
      identification: identification,
    });

    if (selectedDialogId)
      identification[selectedDialogId] = updatedResponses[selectedDialogId]?.value;

    if (
      questions?.values[selectedQuestionId] &&
      !updatedResponses[selectedQuestionId]?.concluding
    ) {
      setSelectedDialogId(
        newQuestions.values[selectedQuestionId]
          ? newQuestions.values[selectedQuestionId].nextId
          : undefined
      );
    }

    setAvailableQuestions(newAvailability);

    setResponses(() => {
      return updatedResponses;
    });
  };

  const handleResponseCallback = useCallback(
    (selectedQuestionId: IdentificationQuestionsId, option: IdentificationQuestionOption) =>
      handleResponse(selectedQuestionId, option),
    [selectedDialogId, responses]
  );

  return {
    questions,
    responses,
    selectedDialogId,
    availableQuestions,
    setSelectedDialogId,
    handleResponseCallback,
  };
}
