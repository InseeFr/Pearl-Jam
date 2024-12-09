import D from 'i18n';
import { identificationAnswerTypeEnum } from './IdentificationAnswersEnum';

export const identificationQuestionsEnum = {
  IDENTIFICATION: {
    type: identificationAnswerTypeEnum.IDENTIFICATION,
    value: `${D.housingIdentification}`,
  },
  ACCESS: { type: identificationAnswerTypeEnum.ACCESS, value: `${D.housingAccess}` },
  SITUATION: { type: identificationAnswerTypeEnum.SITUATION, value: `${D.housingSituation}` },
  CATEGORY: { type: identificationAnswerTypeEnum.CATEGORY, value: `${D.housingCategory}` },
  OCCUPANT: { type: identificationAnswerTypeEnum.OCCUPANT, value: `${D.housingOccupant}` },
} as const;
