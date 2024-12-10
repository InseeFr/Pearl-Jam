import { useState } from 'react';
import {
  IdentificationConfiguration,
  IdentificationQuestionsId,
} from 'utils/enum/identifications/IdentificationsQuestionsRefactored';
import { SurveyUnit } from 'types/pearl';
import { surveyUnitStateEnum } from 'utils/enum/SUStateEnum';
import { addNewState, persistSurveyUnit } from 'utils/functions';
import {
  checkAvailability,
  IdentificationQuestionOption,
  identificationQuestions,
  ResponseState,
} from 'utils/functions/identifications/identificationFunctionsRefactored';

export function useIdentification(
  surveyUnit: SurveyUnit,
  configuration: IdentificationConfiguration
) {
  const questions = identificationQuestions[configuration];
  const initialResponses = Object.fromEntries(Object.values(questions).map(id => [id, undefined]));

  const initialAvailability: Partial<Record<IdentificationQuestionsId, boolean>> =
    Object.fromEntries(Object.keys(questions).map(id => [id, true]));

  const [responses, setResponses] = useState<ResponseState>(initialResponses);
  const [selectedDialogId, setSelectedDialogId] = useState<IdentificationQuestionsId | null>(null);
  const [availableQuestions, setAvailableQuestions] = useState(initialAvailability);

  const handleResponse = (
    questionId: IdentificationQuestionsId,
    option: IdentificationQuestionOption
  ) => {
    // TODO : Recontruistre le reperage à partir d'idb
    setResponses(prev => {
      const updatedResponses = { ...prev, [questionId]: option };
      const updatedAvailability = Object.fromEntries(
        Object.entries(questions).map(([questionId, question]) => {
          return [questionId, checkAvailability(question, updatedResponses)];
        })
      ) as Record<IdentificationQuestionsId, boolean>;

      setAvailableQuestions(updatedAvailability);

      if (option.concluding) {
        const newStates = addNewState(surveyUnit, surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type);
        persistSurveyUnit({ ...surveyUnit, states: newStates });
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
