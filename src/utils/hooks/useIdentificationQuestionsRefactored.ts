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
} from 'utils/functions/identifications/identificationFunctionsRefactored';

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
          let updateState = true;
          if (!updatedResponses[question.id] && available) {
            updateState = false;
          }

          let identification: SurveyUnitIdentification = surveyUnit.identification;
          if (!available) {
            identification[question.id] = undefined;
            updatedResponses[question.id] = undefined;
          } else if (question.options.find(o => o.value === option.value)) {
            identification[question.id] = option.value;
          }

          if (option.concluding) {
            if (updateState) {
              const newStates = addNewState(
                surveyUnit,
                surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type
              );

              persistSurveyUnit({
                ...surveyUnit,
                states: newStates,
                identification: identification,
              });
            } else {
              persistSurveyUnit({ ...surveyUnit, identification: identification });
            }
          } else if (selectedQuestionId === question.id) {
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
