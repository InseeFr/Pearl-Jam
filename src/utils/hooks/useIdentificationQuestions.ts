import { useState } from 'react';
import {
  IdentificationConfiguration,
  IdentificationQuestionsId,
} from 'utils/enum/identifications/IdentificationsQuestionsRefactored';
import { SurveyUnit, SurveyUnitIdentification } from 'types/pearl';
import { surveyUnitStateEnum } from 'utils/enum/SUStateEnum';
import { addNewState, persistSurveyUnit } from 'utils/functions';
import {
  checkAvailability,
  IdentificationQuestionOption,
  identificationQuestions,
  ResponseState,
} from 'utils/functions/identifications/identificationFunctions';

export function useIdentification(surveyUnit: SurveyUnit) {
  const questions =
    identificationQuestions[IdentificationConfiguration[surveyUnit.identificationConfiguration]];
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
      let updatedResponses = { ...prev, [selectedQuestionId]: option };
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

          if (
            Object.values(responses).some(response => response?.concluding === true) ||
            option.concluding
          ) {
            let concludingQuestionIndex = orderedQuestions.findIndex(
              question => responses[question.id]?.concluding === true
            );
            if (option.concluding) {
              concludingQuestionIndex = orderedQuestions.findIndex(
                q => q.id === selectedQuestionId
              );
            }

            const previousQuestions = orderedQuestions.slice(0, concludingQuestionIndex + 1);

            const allAnswered = previousQuestions.every(q => !!updatedResponses[q.id]);

            if (allAnswered) {
              const newStates = addNewState(
                surveyUnit,
                surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type
              );
              persistSurveyUnit({
                ...surveyUnit,
                states: newStates,
                identification: identification,
              });
            }
          }

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
