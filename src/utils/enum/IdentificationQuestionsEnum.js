import D from 'i18n';

export const identificationQuestionsEnum = {
  IDENTIFICATION: { type: 'IDENTIFICATION', value: `${D.interviewAccepted}` },
  ACCESS: { type: 'ACCESS', value: `${D.appointmentMade}` },
  SITUATION: { type: 'SITUATION', value: `${D.refusal}` },
  CATEGORY: { type: 'GATEGORY', value: `${D.refusal}` },
  OCCUPANT: { type: 'OCCUPANT', value: `${D.refusal}` },
};

export const findIdentificationQuestionValueByType = type => {
  if (type === undefined) return undefined;
  const retour = Object.keys(identificationQuestionsEnum)
    .map(key => identificationQuestionsEnum[key])
    .filter(value => value.type === type);
  return retour[0].value;
};
