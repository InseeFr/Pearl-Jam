import D from 'i18n';

export const mediumEnum = {
  EMAIL: { type: 'INA', value: `${D.interviewAccepted}` },
  TEL: { type: 'APT', value: `${D.appointmentMade}` },
  FIELD: { type: 'REF', value: `${D.refusal}` },
};

export const findMediumValueByType = type => {
  if (type === undefined) return undefined;
  const retour = Object.keys(mediumEnum)
    .map(key => mediumEnum[key])
    .filter(value => value.type === type);
  return retour[0].value;
};
