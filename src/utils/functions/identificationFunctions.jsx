import {
  identificationAnswersEnum as answers,
  identificationAnswerTypeEnum,
} from 'utils/enum/IdentificationAnswersEnum';

import { identificationConfigurationEnum } from 'utils/enum/IdentificationConfigurationEnum';

const getIascoAnswersByQuestionType = type =>
  Object.values(answers).filter(({ questionType }) => questionType === type);

const filterByQuestionType = (answersArray, type) =>
  answersArray.filter(answer => answer?.questionType === type)?.[0]?.value;

export const formatToSave = data => {
  // TODO : use identificationConfiguration to adapt to later data formats
  const reducedAnswers = data.map(question => question.selectedAnswer);
  return {
    identification: filterByQuestionType(
      reducedAnswers,
      identificationAnswerTypeEnum.IDENTIFICATION
    ),
    access: filterByQuestionType(reducedAnswers, identificationAnswerTypeEnum.ACCESS),
    situation: filterByQuestionType(reducedAnswers, identificationAnswerTypeEnum.SITUATION),
    category: filterByQuestionType(reducedAnswers, identificationAnswerTypeEnum.CATEGORY),
    occupant: filterByQuestionType(reducedAnswers, identificationAnswerTypeEnum.OCCUPANT),
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

export const identificationIsValidIasco = identificationToCheck => {
  if (!identificationToCheck) return false;
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
      return identificationIsValidIasco(identification);
    case identificationConfigurationEnum.NOIDENT:
    default:
      return identifiationIsValidNoident(identification);
  }
};
