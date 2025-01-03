import { useState } from 'react';
import {
  IdentificationConfiguration,
  IdentificationQuestionsId,
} from 'utils/enum/identifications/IdentificationsQuestions';
import { SurveyUnit, SurveyUnitIdentification } from 'types/pearl';
import { surveyUnitStateEnum } from 'utils/enum/SUStateEnum';
import { addNewState, persistSurveyUnit } from 'utils/functions';
import {
  checkAvailability,
  identificationIsFinished,
  IdentificationQuestionOption,
  identificationQuestionsTree,
  IdentificationQuestionValue,
  ResponseState,
} from 'utils/functions/identifications/identificationFunctions';

const updateStates = (
  surveyUnit: SurveyUnit,
  questions: Partial<Record<IdentificationQuestionsId, IdentificationQuestionValue>>,
  selectedQuestionId: IdentificationQuestionsId,
  updatedResponses: Partial<Record<IdentificationQuestionsId, IdentificationQuestionOption>>
) => {
  const orderedQuestions = Object.values(questions);

  let concludingQuestionIndex = orderedQuestions.findIndex(
    question => updatedResponses[question.id]?.concluding === true
  );
  if (updatedResponses[selectedQuestionId]?.concluding) {
    concludingQuestionIndex = orderedQuestions.findIndex(q => q.id === selectedQuestionId);
  }

  const previousQuestions = orderedQuestions.slice(0, concludingQuestionIndex + 1);
  const allAnswered = previousQuestions.every(q => !!surveyUnit.identification?.[q.id]);
  return allAnswered
    ? addNewState(surveyUnit, surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type)
    : undefined;
};

const persistStates = (surveyUnit: SurveyUnit, states: any) => {
  persistSurveyUnit({
    ...surveyUnit,
    states: states,
  });
};

const persistIdentification = (
  surveyUnit: SurveyUnit,
  identification: Partial<Record<IdentificationQuestionsId, string>>
) => {
  persistSurveyUnit({
    ...surveyUnit,
    identification: identification,
  });
};

export function useIdentification(surveyUnit: SurveyUnit) {
  const questions =
    identificationQuestionsTree[
      IdentificationConfiguration[surveyUnit.identificationConfiguration]
    ];

  const initialResponses: ResponseState = Object.fromEntries(
    Object.keys(questions).map(id => [
      id,
      questions[id as IdentificationQuestionsId]?.options.find(
        o => o.value === surveyUnit?.identification?.[id as IdentificationQuestionsId]
      ),
    ])
  );

  const initialAvailability: Partial<Record<IdentificationQuestionsId, boolean>> =
    Object.fromEntries(
      Object.entries(questions).map(([questionId, question]) => [
        questionId,
        checkAvailability(questions, question, initialResponses),
      ])
    );

  const [responses, setResponses] = useState<ResponseState>(initialResponses);
  const [selectedDialogId, setSelectedDialogId] = useState<IdentificationQuestionsId | undefined>(
    undefined
  );
  const [availableQuestions, setAvailableQuestions] = useState(initialAvailability);

  const handleResponse = (
    selectedQuestionId: IdentificationQuestionsId,
    option: IdentificationQuestionOption
  ) => {
    let updatedResponses: ResponseState = { ...responses, [selectedQuestionId]: option };
    let identification: SurveyUnitIdentification = surveyUnit.identification ?? {};
    setResponses(() => {
      const updatedAvailability = Object.fromEntries(
        Object.entries(questions).map(([questionId, question]) => {
          const available = checkAvailability(questions, question, updatedResponses);

          if (!available) {
            updatedResponses[question.id] = undefined;
          } else if (question.options.find(o => o.value === option.value)) {
            updatedResponses[question.id] = option;
          }

          if (!option.concluding && selectedQuestionId === question.id) {
            setSelectedDialogId(question.nextId);
          }

          identification[question.id] = updatedResponses[question.id]?.value;
          return [questionId, available];
        })
      );

      // Prevent rerender
      if (updatedAvailability != availableQuestions) setAvailableQuestions(updatedAvailability);

      persistIdentification(surveyUnit, identification);

      if (
        selectedDialogId &&
        identificationIsFinished(surveyUnit.identificationConfiguration, identification)
      ) {
        const states = updateStates(surveyUnit, questions, selectedDialogId, updatedResponses);
        persistStates(surveyUnit, states ?? surveyUnit.states);
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
