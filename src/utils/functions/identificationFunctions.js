import { useEffect, useState } from 'react';

import { identificationAnswersEnum as answers } from 'utils/enum/IdentificationAnswersEnum';
import { identificationConfigurationEnum } from 'utils/enum/IdentificationConfigurationEnum';
import { identificationQuestionsEnum } from 'utils/enum/IdentificationQuestionsEnum';

export const useIdentification = (identificationConfiguration, previousData) => {
  const [data, setData] = useState(undefined);
  // previousData structure :
  // IASCO -- {identification, access, situation, category, occupant}

  const updateIdentification = answer => {
    const { updatedData, update } = data.reduce(
      ({ updatedData, update }, current) => {
        // if update already performed : set selectedAnswers to undefined
        if (update) {
          current = { ...current, selectedAnswer: undefined };
          return {
            updatedData: [...updatedData, current],
            update,
          };
        }
        // check if really an update : valid type && (no previousAnswer || different previousAnswer)
        if (
          current.answers.filter(currentAnswer => currentAnswer.type === answer.type).length > 0 &&
          (!current.selectedAnswer ||
            (current.selectedAnswer && current.selectedAnswer.type !== answer.type))
        ) {
          current = { ...current, selectedAnswer: answer };
          update = true;
        }
        return { updatedData: [...updatedData, current], update };
      },
      {
        updatedData: [],
        update: false,
      }
    );
    if (update) {
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
    answers: data?.map(q => {
      return q.selectedAnswer;
    }),
    updateIdentification: updateIdentification,
  };
};

const getAnswersByQuestionType = (type, config) => {
  switch (config) {
    case 'IASCO':
      return getIascoAnswersByQuestionType(type);
    case 'NOIDENT':
    default:
      return [];
  }
};

const getIascoAnswersByQuestionType = type => {
  let answers;
  switch (type) {
    case 'IDENTIFICATION':
      answers = IASCO_IDENTIFICATION_ANSWERS;
      break;
    case 'ACCESS':
      answers = IASCO_ACCESS_ANSWERS;
      break;
    case 'SITUATION':
      answers = IASCO_SITUATION_ANSWERS;
      break;
    case 'CATEGORY':
      answers = IASCO_CATEGORY_ANSWERS;
      break;
    case 'OCCUPANT':
      answers = IASCO_OCCUPANT_ANSWERS;
      break;
    default:
      answers = [];
  }
  return answers.map(ans => {
    return { ...ans, questionType: type };
  });
};

export const IASCO_IDENTIFICATION_ANSWERS = [
  answers.IDENTIFICATION_IDENTIFIED,
  answers.IDENTIFICATION_UNIDENTIFIED,
  answers.IDENTIFICATION_DESTROYED,
];
export const IASCO_ACCESS_ANSWERS = [answers.ACCESS_ACC, answers.ACCESS_NAC];
export const IASCO_SITUATION_ANSWERS = [
  answers.SITUATION_ORDINARY,
  answers.SITUATION_NORDINARY,
  answers.SITUATION_ABSORBED,
];
export const IASCO_CATEGORY_ANSWERS = [
  answers.CATEGORY_PRIMARY,
  answers.CATEGORY_SECONDARY,
  answers.CATEGORY_OCCASIONAL,
  answers.CATEGORY_VACANT,
  answers.CATEGORY_DK,
];
export const IASCO_OCCUPANT_ANSWERS = [answers.OCCUPANT_IDENTIFIED, answers.OCCUPANT_UNIDENTIFIED];

const filterByQuestionType = (answers, type) =>
  answers.filter(ans => ans && ans.questionType === type)?.[0]?.value;

export const formatToSave = data => {
  // TODO : use identificationConfiguration to adapt to other data formats
  const answers = data.map(question => question.selectedAnswer);
  return {
    identification: filterByQuestionType(answers, 'IDENTIFICATION'),
    access: filterByQuestionType(answers, 'ACCESS'),
    situation: filterByQuestionType(answers, 'SITUATION'),
    category: filterByQuestionType(answers, 'CATEGORY'),
    occupant: filterByQuestionType(answers, 'OCCUPANT'),
  };
};

export const IASCO_IDENTIFICATION_FINISHING_VALUES = [
  answers.IDENTIFICATION_DESTROYED.value,
  answers.IDENTIFICATION_UNIDENTIFIED.value,
];
export const IASCO_ACCESS_FINISHING_VALUES = [answers.ACCESS_NAC.value];
export const IASCO_SITUATION_FINISHING_VALUES = [
  answers.SITUATION_NORDINARY.value,
  answers.SITUATION_ABSORBED.value,
];
export const IASCO_CATEGORY_FINISHING_VALUES = [
  answers.CATEGORY_OCCASIONAL.value,
  answers.CATEGORY_VACANT.value,
];
export const IASCO_OCCUPANT_FINISHING_VALUES = [
  answers.OCCUPANT_IDENTIFIED.value,
  answers.OCCUPANT_UNIDENTIFIED.value,
];

const identifiationIsValidIasco = su => {
  const {
    identification: { identification, access, situation, category, occupant },
  } = su;
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
const identifiationIsValidNoident = su => {
  return true;
};

export const identificationIsFinished = su => {
  const { identificationConfiguration } = su;
  switch (identificationConfiguration) {
    case identificationConfigurationEnum.IASCO:
      return identifiationIsValidIasco(su);
    case identificationConfigurationEnum.NOIDENT:
    default:
      return identifiationIsValidNoident(su);
  }
};
