import { useState } from 'react';
import { IdentificationQuestionsId } from 'utils/enum/identifications/IdentificationsQuestionsRefactored';
import { SurveyUnit } from 'types/pearl';
import { surveyUnitStateEnum } from 'utils/enum/SUStateEnum';
import { addNewState, persistSurveyUnit } from 'utils/functions';
import {
  checkAvailability,
  IdentificationQuestionOption,
  questions,
} from 'utils/functions/identifications/identificationFunctionsRefactored';

export function useIdentification(surveyUnit: SurveyUnit) {
  const initialResponses = Object.fromEntries(Object.values(questions).map(id => [id, undefined]));

  const initialAvailability = Object.fromEntries(
    Object.keys(questions).map(id => [id, true])
  ) as Record<IdentificationQuestionsId, boolean>;

  const [responses, setResponses] = useState(initialResponses);
  const [selectedDialogId, setSelectedDialogId] = useState<IdentificationQuestionsId | null>(null);
  const [availableQuestions, setAvailableQuestions] = useState(initialAvailability);

  const handleResponse = (
    questionId: IdentificationQuestionsId,
    option: IdentificationQuestionOption
  ) => {
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

        // TO DO : Persister le nouveau reperage
        // TO DO : Recontruistre le reperage à partir d'idb
        // persistSurveyUnit({
        //   ...surveyUnit,
        //   identification,
        // });
      }

      return updatedResponses;
    });
  };

  return {
    responses,
    selectedDialogId,
    availableQuestions,
    setSelectedDialogId,
    handleResponse,
  };
}
