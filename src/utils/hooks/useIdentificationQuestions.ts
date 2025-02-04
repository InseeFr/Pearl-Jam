import { useEffect, useState } from 'react';
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
  IdentificationQuestionValue,
  ResponseState,
} from 'utils/functions/identifications/identificationFunctions';

export const persistStates = (surveyUnit: SurveyUnit, states: any) => {
  persistSurveyUnit({
    ...surveyUnit,
    states: states,
  });
};

export const persistIdentification = (
  surveyUnit: SurveyUnit,
  identification: Partial<Record<IdentificationQuestionsId, string>>
) => {
  persistSurveyUnit({
    ...surveyUnit,
    identification: identification,
  });
};

export function useIdentificationQuestions(surveyUnit: SurveyUnit) {
  const [questions, setQuestions] = useState<Omit<IdentificationQuestions, 'root'>>({});
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
    if (!dialogId || !questions[dialogId]?.disabled) return dialogId;

    const nextId = questions[dialogId].nextId;
    return setNextDialogId(questions, nextId);
  };

  useEffect(() => {
    const { root, ...newQuestions } = getIdentificationQuestionsTree(
      surveyUnit.identificationConfiguration,
      surveyUnit.identification
    );

    const newResponses: ResponseState = Object.fromEntries(
      Object.keys(newQuestions).map(id => [
        id,
        newQuestions[id as IdentificationQuestionsId]?.options.find(
          o => o.value === surveyUnit?.identification?.[id as IdentificationQuestionsId]
        ),
      ])
    );

    const newAvailability: Partial<Record<IdentificationQuestionsId, boolean>> = Object.fromEntries(
      Object.entries(newQuestions).map(([questionId, question]) => [
        questionId,
        checkAvailability(newQuestions, question, newResponses),
      ])
    );

    setNextDialogId(newQuestions, selectedDialogId);
    setQuestions(newQuestions);
    setResponses(newResponses);
    setAvailableQuestions(newAvailability);
  }, [JSON.stringify(surveyUnit.identification)]);

  const handleResponse = (
    selectedQuestionId: IdentificationQuestionsId,
    option: IdentificationQuestionOption
  ) => {
    let updatedResponses: ResponseState = { ...responses, [selectedQuestionId]: option };
    let identification: SurveyUnitIdentification = surveyUnit.identification ?? {};
    let setResponsesAsUndefined = false;
    const availableQuestionIds = Object.entries(questions).map(([questionId, question]) => {
      const available = checkAvailability(questions, question, updatedResponses);

      if (!available || setResponsesAsUndefined) updatedResponses[question.id] = undefined;
      else if (questionId === selectedQuestionId) {
        updatedResponses[question.id] = option;
        setResponsesAsUndefined = true;
      }

      identification[question.id] = updatedResponses[question.id]?.value;
      return [questionId, available];
    });

    setResponses(() => {
      const updatedAvailability = Object.fromEntries(availableQuestionIds);

      if (questions[selectedQuestionId] && !updatedResponses[selectedQuestionId]?.concluding) {
        setSelectedDialogId(questions[selectedQuestionId].nextId);
      }

      // Prevent rerender
      if (updatedAvailability != availableQuestions) setAvailableQuestions(updatedAvailability);

      persistIdentification(surveyUnit, identification);

      if (isIdentificationFinished(surveyUnit.identificationConfiguration, identification)) {
        persistStates(
          surveyUnit,
          addNewState(surveyUnit, surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type)
        );
      }

      return updatedResponses;
    });
  };

  return {
    questions,
    responses,
    selectedDialogId,
    availableQuestions,
    setSelectedDialogId,
    handleResponse,
  };
}
