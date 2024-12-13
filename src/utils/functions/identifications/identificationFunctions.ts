import {
  IdentificationConfiguration,
  IdentificationQuestionsId,
} from 'utils/enum/identifications/IdentificationsQuestions';
import { identificationQuestionsTel } from './questionings/questioningByTel';
import { identificationQuestionsIASCO } from './questionings/questioningByIASCO';

export type IdentificationQuestionOption = {
  value: string;
  label: string;
  concluding: boolean;
};
export type IdentificationQuestionValue = {
  id: IdentificationQuestionsId;
  nextId?: IdentificationQuestionsId;
  text: string;
  options: IdentificationQuestionOption[];
  dependsOn?: { questionId: IdentificationQuestionsId; values: string[] };
};

export type IdentificationQuestions = Partial<
  Record<IdentificationQuestionsId, IdentificationQuestionValue>
>;

// TODO : Construire identificationQuestionsIASCO, identificationQuestionsNoident
export const identificationQuestionsNoIdent = {};

export const identificationQuestions: Record<IdentificationConfiguration, IdentificationQuestions> =
  {
    [IdentificationConfiguration.INDTEL]: identificationQuestionsTel,
    [IdentificationConfiguration.IASCO]: identificationQuestionsIASCO,
    [IdentificationConfiguration.NOIDENT]: identificationQuestionsNoIdent,
  };

export type ResponseState = Partial<
  Record<IdentificationQuestionsId, IdentificationQuestionOption>
>;

export function checkAvailability(
  questions: IdentificationQuestions,
  question?: IdentificationQuestionValue,
  responses?: ResponseState
): boolean {
  if (!responses) return true;
  const dependency = question?.dependsOn;
  if (!dependency) return true;
  if (responses[dependency.questionId]?.concluding) return false;

  // Recursively check if the parent question is itself available
  const parentResponseQuestion = questions[dependency.questionId];
  if (parentResponseQuestion)
    return checkAvailability(questions, parentResponseQuestion, responses);

  // If the parent question has a response, check if its value satisfies the dependency condition
  const parentResponse = responses[dependency.questionId];
  if (parentResponse) return dependency.values.includes(parentResponse.value);

  return true;
}
