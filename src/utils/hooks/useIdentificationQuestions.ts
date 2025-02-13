import { useEffect, useState } from "react";
import { IdentificationQuestionsId } from "utils/enum/identifications/IdentificationsQuestions";
import { SurveyUnit, SurveyUnitIdentification } from "types/pearl";
import { surveyUnitStateEnum } from "utils/enum/SUStateEnum";
import { addNewState, persistSurveyUnit } from "utils/functions";
import {
  checkAvailability,
  isIdentificationFinished,
  IdentificationQuestionOption,
  IdentificationQuestions,
  getIdentificationQuestionsTree,
  ResponseState,
} from "utils/functions/identifications/identificationFunctions";

export function useIdentificationQuestions(surveyUnit: SurveyUnit) {
  const [questions, setQuestions] = useState<
    Omit<IdentificationQuestions, "root">
  >({});
  const [responses, setResponses] = useState<ResponseState>({});
  const [availableQuestions, setAvailableQuestions] = useState<
    Partial<Record<IdentificationQuestionsId, boolean>>
  >({});
  const [selectedDialogId, setSelectedDialogId] = useState<
    IdentificationQuestionsId | undefined
  >(undefined);

  const setNextDialogId = (
    questions: IdentificationQuestions,
    dialogId?: IdentificationQuestionsId
  ) => {
    if (!dialogId || !questions[dialogId]?.disabled) return dialogId;

    const nextId = questions[dialogId].nextId;
    return setNextDialogId(questions, nextId);
  };

  useEffect(() => {
    let identification = { ...surveyUnit.identification };
    if (selectedDialogId && identification[selectedDialogId])
      identification[selectedDialogId] = undefined;

    const { root, ...newQuestions } = getIdentificationQuestionsTree(
      surveyUnit.identificationConfiguration,
      identification
    );

    const newResponses: ResponseState = Object.fromEntries(
      Object.keys(newQuestions).map((id) => [
        id,
        newQuestions[id as IdentificationQuestionsId]?.options.find(
          (o) =>
            o.value ===
            surveyUnit?.identification?.[id as IdentificationQuestionsId]
        ),
      ])
    );

    const newAvailability: Partial<Record<IdentificationQuestionsId, boolean>> =
      Object.fromEntries(
        Object.entries(newQuestions).map(([questionId, question]) => [
          questionId,
          checkAvailability(newQuestions, question, newResponses),
        ])
      );

    const newDialogId = setNextDialogId(newQuestions, selectedDialogId);
    setSelectedDialogId(newDialogId);
    setQuestions(newQuestions);
    setResponses(newResponses);
    setAvailableQuestions(newAvailability);
  }, [JSON.stringify(surveyUnit.identification), selectedDialogId]);

  const handleResponse = (
    selectedQuestionId: IdentificationQuestionsId,
    option: IdentificationQuestionOption
  ) => {
    let updatedResponses: ResponseState = {
      ...responses,
      [selectedQuestionId]: option,
    };
    let identification: SurveyUnitIdentification =
      surveyUnit.identification ?? {};
    let setResponsesAsUndefined = false;
    const availableQuestionIds = Object.entries(questions).map(
      ([questionId, question]) => {
        const available = checkAvailability(
          questions,
          question,
          updatedResponses
        );

        if (!available || setResponsesAsUndefined)
          updatedResponses[question.id] = undefined;
        else if (questionId === selectedQuestionId) {
          updatedResponses[question.id] = option;
          setResponsesAsUndefined = true;
        }

        identification[question.id] = updatedResponses[question.id]?.value;
        return [questionId, available];
      }
    );

    setResponses(() => {
      const updatedAvailability = Object.fromEntries(availableQuestionIds);

      if (
        questions[selectedQuestionId] &&
        !updatedResponses[selectedQuestionId]?.concluding
      ) {
        setSelectedDialogId(questions[selectedQuestionId].nextId);
      }

      // Prevent rerender
      if (updatedAvailability != availableQuestions)
        setAvailableQuestions(updatedAvailability);

      let newStates = surveyUnit.states;
      if (
        isIdentificationFinished(
          surveyUnit.identificationConfiguration,
          identification
        )
      )
        newStates = addNewState(
          surveyUnit,
          surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type
        );

      persistSurveyUnit({
        ...surveyUnit,
        states: newStates,
        identification: identification,
      });

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
