import D from 'i18n';

export const identificationQuestionsEnum = {
  IDENTIFICATION: { type: 'IDENTIFICATION', value: `${D.housingIdentification}` },
  ACCESS: { type: 'ACCESS', value: `${D.housingAccess}` },
  SITUATION: { type: 'SITUATION', value: `${D.housingSituation}` },
  CATEGORY: { type: 'CATEGORY', value: `${D.housingCategory}` },
  OCCUPANT: { type: 'OCCUPANT', value: `${D.housingOccupant}` },
};

export const findIdentificationQuestionValueByType = type =>
  Object.values(identificationQuestionsEnum).filter(value => value.type === type)?.[0]?.value;
