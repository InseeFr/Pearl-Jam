import {
  identificationAnswersEnum as answers,
  identificationAnswerTypeEnum,
} from 'utils/enum/IdentificationAnswersEnum';
import { useEffect, useState } from 'react';

import { identificationConfigurationEnum } from 'utils/enum/IdentificationConfigurationEnum';
import { identificationQuestionsEnum } from 'utils/enum/IdentificationQuestionsEnum';

export const useIdentification = (identificationConfiguration, previousData) => {
  const [data, setData] = useState(undefined);
  const [visibleAnswers, setVisibleAnswers] = useState(
    data?.filter(question => question.selected)?.[0]?.answers ?? data?.[0].answers ?? undefined
  );

  console.log('data ', data);
  const updateIdentification = answer => {
    const { updatedData, update, finished } = data
      .map(question => ({ ...question, disabled: false, selected: false }))
      .reduce(
        ({ updatedData, update, finished, selectNext }, current) => {
          if (selectNext) {
            setVisibleAnswers(current.answers);
          }
          if (update || finished) {
            current = {
              ...current,
              selectedAnswer: undefined,
              disabled: finished,
              selected: selectNext && !finished,
            };
            return {
              updatedData: [...updatedData, current],
              update,
              finished,
              selectNext: false,
            };
          }
          // check if really an update : valid type && (no previousAnswer || different previousAnswer)
          if (
            current.answers.filter(currentAnswer => currentAnswer.type === answer.type).length >
              0 &&
            (!current.selectedAnswer || current?.selectedAnswer.type !== answer.type)
          ) {
            current = { ...current, selectedAnswer: answer, selected: selectNext };
            update = true;
            selectNext = true;
          }
          return {
            updatedData: [...updatedData, current],
            update,
            finished: answer.concluding,
            selectNext,
          };
        },
        {
          updatedData: [],
          update: false,
          selectNext: false,
          finished: false,
        }
      );
    if (update || finished) {
      setData(updatedData);
    }
  };

  useEffect(() => {
    const getQuestions = config => {
      switch (config) {
        case identificationConfigurationEnum.IASCO:
          return identificationQuestionsEnum;
        case identificationConfigurationEnum.NOIDENT:
        default:
          return undefined;
      }
    };
    const getSelectedAnswer = (type, typedAnswers) => {
      if (!previousData) return undefined;
      const value = previousData[type.toLowerCase()];
      const filteredAnswers = typedAnswers.filter(ans => ans.value === value);
      return filteredAnswers?.[0];
    };

    const generateInitData = questions => {
      if (!questions) return [];

      return Object.values(questions).map(({ type, value }) => {
        const typedAnswers = getAnswersByQuestionType(type, identificationConfiguration);
        return {
          label: value,
          type,
          selectedAnswer: getSelectedAnswer(type, typedAnswers),
          answers: typedAnswers,
        };
      });
    };

    setData(generateInitData(getQuestions(identificationConfiguration)));
  }, [identificationConfiguration, previousData]);

  return {
    data,
    answers: data?.map(({ selectedAnswer }) => selectedAnswer),
    visibleAnswers,
    updateIdentification,
    setVisibleAnswers,
  };
};

const getAnswersByQuestionType = (type, config) => {
  switch (config) {
    case identificationConfigurationEnum.IASCO:
      return getIascoAnswersByQuestionType(type);
    case identificationConfigurationEnum.NOIDENT:
    default:
      return [];
  }
};

const getIascoAnswersByQuestionType = type =>
  Object.values(answers).filter(({ questionType }) => questionType === type);

const filterByQuestionType = (answers, type) =>
  answers.filter(({ questionType }) => questionType ?? {} === type)?.[0]?.value;

export const formatToSave = data => {
  // TODO : use identificationConfiguration to adapt to later data formats
  const answers = data.map(question => question.selectedAnswer);
  return {
    identification: filterByQuestionType(answers, identificationAnswerTypeEnum.IDENTIFICATION),
    access: filterByQuestionType(answers, identificationAnswerTypeEnum.ACCESS),
    situation: filterByQuestionType(answers, identificationAnswerTypeEnum.SITUATION),
    category: filterByQuestionType(answers, identificationAnswerTypeEnum.CATEGORY),
    occupant: filterByQuestionType(answers, identificationAnswerTypeEnum.OCCUPANT),
  };
};

const getFinishingAnswersByType = targetType =>
  getIascoAnswersByQuestionType(targetType).filter(({ concluding }) => concluding);

export const IASCO_IDENTIFICATION_FINISHING_VALUES = getFinishingAnswersByType(
  identificationAnswerTypeEnum.IDENTIFICATION
).map(({ value }) => value);
export const IASCO_ACCESS_FINISHING_VALUES = getFinishingAnswersByType(
  identificationAnswerTypeEnum.ACCESS
).map(({ value }) => value);
export const IASCO_SITUATION_FINISHING_VALUES = getFinishingAnswersByType(
  identificationAnswerTypeEnum.SITUATION
).map(({ value }) => value);
export const IASCO_CATEGORY_FINISHING_VALUES = getFinishingAnswersByType(
  identificationAnswerTypeEnum.CATEGORY
).map(({ value }) => value);
export const IASCO_OCCUPANT_FINISHING_VALUES = getFinishingAnswersByType(
  identificationAnswerTypeEnum.OCCUPANT
).map(({ value }) => value);

export const identifiationIsValidIasco = identificationToCheck => {
  const { identification, access, situation, category, occupant } = identificationToCheck;
  if (identification === undefined) return false;
  if (IASCO_IDENTIFICATION_FINISHING_VALUES.includes(identification)) return true;
  if (access === undefined) return false;
  if (IASCO_ACCESS_FINISHING_VALUES.includes(access)) return true;
  if (situation === undefined) return false;
  if (IASCO_SITUATION_FINISHING_VALUES.includes(situation)) return true;
  if (category === undefined) return false;
  if (IASCO_CATEGORY_FINISHING_VALUES.includes(category)) return true;
  if (occupant === undefined) return false;
  if (IASCO_OCCUPANT_FINISHING_VALUES.includes(occupant)) return true;
  return false;
};
const identifiationIsValidNoident = identificationToCheck => {
  return true;
};

export const identificationIsFinished = (identificationConfiguration, identification) => {
  switch (identificationConfiguration) {
    case identificationConfigurationEnum.IASCO:
      return identifiationIsValidIasco(identification);
    case identificationConfigurationEnum.NOIDENT:
    default:
      return identifiationIsValidNoident(identification);
  }
};
