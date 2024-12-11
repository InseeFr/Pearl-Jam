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
import { LocalHospital } from '@mui/icons-material';

export function useIdentification(surveyUnit: SurveyUnit) {
  const questions =
    identificationQuestions[IdentificationConfiguration[surveyUnit.identificationConfiguration]];
  const initialResponses: ResponseState = Object.fromEntries(
    Object.keys(questions).map(id => [
      id,
      surveyUnit.identification[id as IdentificationQuestionsId],
    ])
  );

  const initialAvailability: Partial<Record<IdentificationQuestionsId, boolean>> =
    Object.fromEntries(Object.keys(questions).map(id => [id, true]));

  const [responses, setResponses] = useState<ResponseState>(initialResponses);
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
          const available = checkAvailability(question, updatedResponses);

          let updateState = true;
          if (!updatedResponses[question.id] && available) {
            updateState = false;
          }

          let identification: SurveyUnitIdentification = surveyUnit.identification;
          if (!available) {
            identification[question.id] = undefined;
          } else if (question.options.find(o => o.value === option.value)) {
            identification[question.id] = option.value;
          }

          console.log(option.concluding);
          console.log(updateState);

          // TODO : make sure all previous responses are valid
          if (option.concluding && updateState) {
            const newStates = addNewState(
              surveyUnit,
              surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type
            );
            console.log(newStates);

            persistSurveyUnit({ ...surveyUnit, states: newStates });
          }

          persistSurveyUnit({ ...surveyUnit, identification: identification });
          return [questionId, available];
        })
      );

      if (option.concluding) {
        const newStates = addNewState(surveyUnit, surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type);
        console.log(newStates);

        persistSurveyUnit({ ...surveyUnit, states: newStates });
      }
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
