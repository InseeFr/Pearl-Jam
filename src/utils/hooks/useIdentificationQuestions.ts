import { useCallback, useState } from 'react';
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
  ResponseState,
} from 'utils/functions/identifications/identificationFunctions';
import { useEffectOnce } from './useEffectOnce';
import D from 'i18n';

const generateResponseState = (
  questions: IdentificationQuestions,
  identification?: SurveyUnitIdentification
): ResponseState =>
  Object.fromEntries(
    Object.entries(questions.values).map(([id, { options }]) => [
      id,
      options.find(o => o.value === identification?.[id as IdentificationQuestionsId]),
    ])
  );

export function useIdentificationQuestions(surveyUnit: SurveyUnit) {
  const [questions, setQuestions] = useState<IdentificationQuestions>({ values: {} });
  const [responses, setResponses] = useState<ResponseState>({});
  const [availableQuestions, setAvailableQuestions] = useState<
    Partial<Record<IdentificationQuestionsId, boolean>>
  >({});
  const [selectedDialogId, setSelectedDialogId] = useState<IdentificationQuestionsId>();

  useEffectOnce(() => {
    const newQuestions = getIdentificationQuestionsTree(
      surveyUnit.identificationConfiguration,
      surveyUnit.identification
    );

    setQuestions(newQuestions);

    const newResponses = generateResponseState(newQuestions, surveyUnit.identification);

    const newAvailability: Partial<Record<IdentificationQuestionsId, boolean>> = Object.fromEntries(
      Object.entries(newQuestions.values).map(([questionId, question]) => [
        questionId,
        checkAvailability(newQuestions.values, question, newResponses),
      ])
    );

    setAvailableQuestions(newAvailability);
    setResponses(newResponses);
  }, [surveyUnit.id]);

  const handleResponse = (
    selectedQuestionId: IdentificationQuestionsId,
    option: IdentificationQuestionOption
  ) => {
    let identification: SurveyUnitIdentification = surveyUnit.identification ?? {};
    identification[selectedQuestionId] = option.value;

    const newQuestions = getIdentificationQuestionsTree(
      surveyUnit.identificationConfiguration,
      identification
    );

    const newResponses = generateResponseState(newQuestions, identification);
    let setResponsesAsUndefined = false;

    const newAvailability: Partial<Record<IdentificationQuestionsId, boolean>> = Object.fromEntries(
      Object.entries(newQuestions.values).map(([questionId, question]) => {
        const available = checkAvailability(newQuestions.values, question, newResponses);

        if (!available || setResponsesAsUndefined) {
          newResponses[question.id] = undefined;
          identification[question.id] = undefined;
        } else if (questionId === selectedQuestionId) {
          newResponses[questionId] = option;
          setResponsesAsUndefined = true;
        }

        if (!available) identification[questionId as IdentificationQuestionsId] = undefined;

        return [questionId, available];
      })
    );

    let newStates = surveyUnit.states;
    if (isIdentificationFinished(surveyUnit.identificationConfiguration, identification))
      newStates = addNewState(surveyUnit, surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type);

    persistSurveyUnit({
      ...surveyUnit,
      states: newStates,
      identification: identification,
    });

    if (selectedDialogId) identification[selectedDialogId] = newResponses[selectedDialogId]?.value;

    if (newQuestions?.values[selectedQuestionId] && !newResponses[selectedQuestionId]?.concluding) {
      setSelectedDialogId(newQuestions.values[selectedQuestionId].nextId);
    }

    setAvailableQuestions(newAvailability);
    setResponses(newResponses);
  };

  const handleResponseCallback = useCallback(
    (selectedQuestionId: IdentificationQuestionsId, option: IdentificationQuestionOption) =>
      handleResponse(selectedQuestionId, option),
    [selectedDialogId, JSON.stringify(surveyUnit.identification)]
  );

  const handleCheckboxChange = useCallback(
    (questionId: IdentificationQuestionsId, isChecked: boolean) => {
      // Special handling for demenagementEnqueteur checkbox
      if (questionId === IdentificationQuestionsId.DEMENAGEMENT_ENQUETEUR) {
        const newIdentification = {
          ...surveyUnit.identification,
          demenagementEnqueteur: isChecked,
        };

        const newStates = isChecked
          ? [{ type: surveyUnitStateEnum.QUESTIONNAIRE_STARTED.type, date: Date.now() }]
          : surveyUnit.states;

        const updatedSurveyUnit = {
          ...surveyUnit,
          identification: newIdentification,
          persons: isChecked
            ? [
                {
                  title: '',
                  firstName: D.surveyUnitFirstName,
                  lastName: D.surveyUnitLastName,
                  email: '',
                  birthdate: 0,
                  favoriteEmail: false,
                  privileged: true,
                  phoneNumbers: [],
                },
              ]
            : surveyUnit.persons,
          states: newStates,
          otherModeQuestionnaireState: isChecked ? [] : surveyUnit.otherModeQuestionnaireState,
        };

        persistSurveyUnit(updatedSurveyUnit);

        // Update local state
        const newQuestions = getIdentificationQuestionsTree(
          surveyUnit.identificationConfiguration,
          newIdentification
        );
        const newResponses = generateResponseState(newQuestions, newIdentification);
        const newAvailability: Partial<Record<IdentificationQuestionsId, boolean>> =
          Object.fromEntries(
            Object.entries(newQuestions.values).map(([qId, question]) => [
              qId,
              checkAvailability(newQuestions.values, question, newResponses),
            ])
          );

        setQuestions(newQuestions);
        setAvailableQuestions(newAvailability);
        setResponses(newResponses);
        return;
      }

      // Default handling for other checkbox questions
      const option: IdentificationQuestionOption = {
        value: isChecked,
        label: questions.values[questionId]?.text ?? '',
        concluding: isChecked,
      };
      handleResponse(questionId, option);
    },
    [JSON.stringify(surveyUnit.identification), questions, surveyUnit]
  );

  return {
    questions,
    responses,
    selectedDialogId,
    availableQuestions,
    setSelectedDialogId,
    handleResponseCallback,
    handleCheckboxChange,
  };
}
