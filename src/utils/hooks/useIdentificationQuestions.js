import { identificationConfigurationEnum } from '../enum/IdentificationConfigurationEnum';
import { identificationQuestionsEnum } from '../enum/IdentificationQuestionsEnum';
import { identificationAnswersEnum } from '../enum/IdentificationAnswersEnum';
import { useMemo, useState } from 'react';
import { addNewState } from '../functions';
import { surveyUnitStateEnum } from '../enum/SUStateEnum';

const getQuestions = config => {
  switch (config) {
    case identificationConfigurationEnum.IASCO:
      return identificationQuestionsEnum;
    case identificationConfigurationEnum.TEL:
      return {
        SITUATION: identificationQuestionsEnum.SITUATION,
        CATEGORY: identificationQuestionsEnum.CATEGORY,
      };
    default:
      return {};
  }
};

const getAnswersByQuestionType = (type, config) => {
  if (!type) {
    return [];
  }
  switch (config) {
    case identificationConfigurationEnum.IASCO:
    case identificationConfigurationEnum.TEL:
      return Object.values(identificationAnswersEnum).filter(a => a.questionType === type);
    case identificationConfigurationEnum.NOIDENT:
    default:
      return [];
  }
};

const getAnswerFromValue = (type, value) => {
  if (!value) {
    return undefined;
  }
  return Object.values(identificationAnswersEnum).find(
    a => a.value === value && a.questionType === type
  );
};

/**
 * @typedef {{questionType: string, type: string, value: string, label: string, concluding: boolean}} Answer
 * @typedef {{type: string, value: string}} Question
 */

/**
 * @param {SurveyUnit} surveyUnit
 */
export function useIdentificationQuestions(surveyUnit) {
  /** @var {undefined | Question} question */
  const [question, setQuestion] = useState();
  const config = surveyUnit.identificationConfiguration;

  // Append selected answer to the question
  let concluded = false;
  const questions = Object.values(getQuestions(config)).map(q => {
    const key = q.type.toLowerCase();
    const question = {
      ...q,
      disabled: concluded,
      answer: concluded ? undefined : getAnswerFromValue(q.type, surveyUnit.identification[key]),
    };
    if (question.answer?.concluding) {
      concluded = true;
    }
    return question;
  });

  /* @var {{questionType: string, value: string, label: string}[]} */
  const answers = useMemo(
    () => getAnswersByQuestionType(question?.type, config),
    [question, config]
  );

  /**
   * @param {Answer} answer
   */
  const setAnswer = answer => {
    // When an answer is marker as "concluded" it makes next answer undefined
    let concluded = false;
    // Build the identification object expected for the surveyUnit
    const identification = Object.fromEntries(
      questions.map(question => {
        const key = question.type.toLowerCase();
        const previousAnswer = surveyUnit.identification[question.type.toLowerCase()];
        let newAnswer = question.type === answer.questionType ? answer.value : previousAnswer;
        // For a concluding answer, mark the questions as "concluded" for the next question
        if (question.type === answer.questionType && answer.concluding) {
          concluded = true;
        } else if (answer.concluding && concluded) {
          newAnswer = undefined;
        }
        return [key, newAnswer];
      })
    );

    if (answer.concluding) {
      setQuestion(undefined);
    } else {
      // Automatically select the next unanswered question or close the current selected question
      const currentIndex = questions.findIndex(q => q.type === question.type);
      const nextIndex = questions.findIndex((q, k) => k > currentIndex && !q.answer);
      setQuestion(nextIndex ? questions[nextIndex] : undefined);
    }

    addNewState(
      {
        ...surveyUnit,
        identification,
      },
      surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type
    );
  };

  return {
    question,
    setQuestion,
    setAnswer,
    answers,
    questions: questions,
  };
}
