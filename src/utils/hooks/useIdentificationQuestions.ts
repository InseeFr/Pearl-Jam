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

const updateState = (
  surveyUnit: SurveyUnit,
  identification: Partial<Record<IdentificationQuestionsId, string>>,
  orderedQuestions: IdentificationQuestionValue[],
  selectedQuestionId: IdentificationQuestionsId,
  option: IdentificationQuestionOption,
  responses: Partial<Record<IdentificationQuestionsId, IdentificationQuestionOption>>,
  updatedResponses: ResponseState
) => {
  let states = undefined;

  if (identificationIsFinished(surveyUnit.identificationConfiguration, identification)) {
    let concludingQuestionIndex = orderedQuestions.findIndex(
      question => responses[question.id]?.concluding === true
    );
    if (option.concluding) {
      concludingQuestionIndex = orderedQuestions.findIndex(q => q.id === selectedQuestionId);
    }

    const previousQuestions = orderedQuestions.slice(0, concludingQuestionIndex + 1);
    const allAnswered = previousQuestions.every(q => !!updatedResponses[q.id]);
    if (allAnswered) {
      states = addNewState(surveyUnit, surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type);
    }
  }
  persistSurveyUnit({
    ...surveyUnit,
    states: states ?? surveyUnit.states,
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
        o => o.value === surveyUnit.identification[id as IdentificationQuestionsId]
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
    setResponses(prev => {
      let updatedResponses: ResponseState = { ...prev, [selectedQuestionId]: option };
      const updatedAvailability = Object.fromEntries(
        Object.entries(questions).map(([questionId, question]) => {
          const available = checkAvailability(questions, question, updatedResponses);
          const orderedQuestions = Object.values(questions);
          let identification: SurveyUnitIdentification = surveyUnit.identification;

          if (!available) {
            identification[question.id] = undefined;
            updatedResponses[question.id] = undefined;
          } else if (question.options.find(o => o.value === option.value)) {
            identification[question.id] = option.value;
          }
          updateState(
            surveyUnit,
            identification,
            orderedQuestions,
            selectedQuestionId,
            option,
            responses,
            updatedResponses
          );

          if (!option.concluding && selectedQuestionId === question.id) {
            setSelectedDialogId(question.nextId);
          }

          return [questionId, available];
        })
      );

      setAvailableQuestions(updatedAvailability);
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
