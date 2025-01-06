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

const allQuestionsAnswered = (
  surveyUnit: SurveyUnit,
  identification: any,
  questions: Partial<Record<IdentificationQuestionsId, IdentificationQuestionValue>>,
  selectedQuestionId: IdentificationQuestionsId | undefined,
  updatedResponses: Partial<Record<IdentificationQuestionsId, IdentificationQuestionOption>>
) => {
  if (
    !identificationIsFinished(surveyUnit.identificationConfiguration, identification) ||
    !selectedQuestionId
  )
    return false;

  const orderedQuestions = Object.values(questions);

  let concludingQuestionIndex = orderedQuestions.findIndex(
    question => updatedResponses[question.id]?.concluding === true
  );
  if (updatedResponses[selectedQuestionId]?.concluding) {
    concludingQuestionIndex = orderedQuestions.findIndex(q => q.id === selectedQuestionId);
  }

  const previousQuestions = orderedQuestions.slice(0, concludingQuestionIndex + 1);
  const allAnswered = previousQuestions.every(q => !!surveyUnit.identification?.[q.id]);
  return allAnswered;
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
    const availableQuestionIds = Object.entries(questions).map(([questionId, question]) => {
      const available = checkAvailability(questions, question, updatedResponses);

      if (!available) {
        updatedResponses[question.id] = undefined;
      } else if (question.options.find(o => o.value === option.value)) {
        updatedResponses[question.id] = option;
      }

      identification[question.id] = updatedResponses[question.id]?.value;
      return [questionId, available];
    });

    setResponses(() => {
      const updatedAvailability = Object.fromEntries(availableQuestionIds);

      if (questions[selectedQuestionId] && !updatedResponses[selectedQuestionId]?.concluding) {
        setSelectedDialogId(questions[selectedQuestionId]?.nextId);
      }

      // Prevent rerender
      if (updatedAvailability != availableQuestions) setAvailableQuestions(updatedAvailability);

      persistIdentification(surveyUnit, identification);

      // States must be updated if identification is fully done and conluding
      const allAnswered = allQuestionsAnswered(
        surveyUnit,
        identification,
        questions,
        selectedDialogId,
        updatedResponses
      );
      if (allAnswered) {
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
