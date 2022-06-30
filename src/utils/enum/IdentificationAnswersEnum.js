import D from 'i18n';

export const identificationQuestionsEnum = {
  IDENTIFICATION_IDENTIFIED: {
    type: 'IDENTIFICATION_IDENTIFIED',
    value: 'IDENTIFIED',
    label: `${D.interviewAccepted}`,
  },
  IDENTIFICATION_UNIDENTIFIED: {
    type: 'IDENTIFICATION_UNIDENTIFIED',
    value: 'UNIDENTIFIED',
    label: `${D.interviewAccepted}`,
  },
  IDENTIFICATION_DESTROYED: {
    type: 'IDENTIFICATION_DESTROYED',
    value: 'DESTROYED',
    label: `${D.interviewAccepted}`,
  },
  ACCESS_ACC: { type: 'ACCESS_ACC', value: 'ACC', label: `${D.appointmentMade}` },
  ACCESS_NAC: { type: 'ACCESS_NAC', value: 'NACC', label: `${D.appointmentMade}` },
  SITUATION_ORDINARY: { type: 'SITUATION_ORDINARY', value: 'ORDINARY', label: `${D.refusal}` },
  SITUATION_ABSORBED: { type: 'SITUATION_ABSORBED', value: 'ABSORBED', label: `${D.refusal}` },
  SITUATION_NORDINARY: { type: 'SITUATION_NORDINARY', value: 'NORDINARY', label: `${D.refusal}` },
  CATEGORY_PRIMARY: { type: 'CATEGORY_PRIMARY', value: 'PRIMARY', label: `${D.refusal}` },
  CATEGORY_OCCASIONAL: { type: 'CATEGORY_OCCASIONAL', value: 'OCCASIONAL', label: `${D.refusal}` },
  CATEGORY_DK: { type: 'CATEGORY_DK', value: 'DK', label: `${D.refusal}` },
  CATEGORY_SECONDARY: { type: 'CATEGORY_SECONDARY', value: 'SECONDARY', label: `${D.refusal}` },
  CATEGORY_VACANT: { type: 'CATEGORY_VACANT', value: 'VACANT', label: `${D.refusal}` },
  OCCUPANT_IDENTIFIED: { type: 'OCCUPANT_IDENTIFIED', value: 'IDENTIFIED', label: `${D.refusal}` },
  OCCUPANT_UNIDENTIFIED: {
    type: 'OCCUPANT_UNIDENTIFIED',
    value: 'UNIDENTIFIED',
    label: `${D.refusal}`,
  },
};

export const findIdentificationQuestionValueByType = type => {
  if (type === undefined) return undefined;
  const retour = Object.keys(identificationQuestionsEnum)
    .map(key => identificationQuestionsEnum[key])
    .filter(value => value.type === type);
  return retour[0].value;
};
