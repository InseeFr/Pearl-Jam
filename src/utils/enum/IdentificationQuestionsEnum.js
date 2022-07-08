import D from 'i18n';

export const identificationQuestionsEnum = {
  IDENTIFICATION: { type: 'IDENTIFICATION', value: `${D.housingIdentification}` },
  ACCESS: { type: 'ACCESS', value: `${D.housingAccess}` },
  SITUATION: { type: 'SITUATION', value: `${D.housingSituation}` },
  CATEGORY: { type: 'CATEGORY', value: `${D.housingCategory}` },
  OCCUPANT: { type: 'OCCUPANT', value: `${D.housingOccupant}` },
};

export const findIdentificationQuestionValueByType = type => {
  if (type === undefined) return undefined;
  const retour = Object.keys(identificationQuestionsEnum)
    .map(key => identificationQuestionsEnum[key])
    .filter(value => value.type === type);
  return retour[0].value;
};
