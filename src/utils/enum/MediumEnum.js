import D from 'i18n';

export const mediumEnum = {
  EMAIL: { type: 'EMAIL', value: `${D.mediumEmail}` },
  TEL: { type: 'TEL', value: `${D.mediumPhone}` },
  FIELD: { type: 'FIELD', value: `${D.mediumFaceToFace}` },
};

export const findMediumValueByType = type => {
  if (type === undefined) return undefined;
  const retour = Object.keys(mediumEnum)
    .map(key => mediumEnum[key])
    .filter(value => value.type === type);
  return retour[0].value;
};

export const getMediumByConfiguration = configuration => {
  switch (configuration) {
    case 'F2F':
      return {
        FIELD: mediumEnum.FIELD,
        TEL: mediumEnum.TEL,
        EMAIL: mediumEnum.EMAIL,
      };
    case 'TEL':
      return {
        TEL: mediumEnum.TEL,
        EMAIL: mediumEnum.EMAIL,
      };
    default:
      return {};
  }
};
