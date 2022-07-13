import D from 'i18n';

export const mediumEnum = {
  EMAIL: { type: 'EMAIL', value: `${D.mediumEmail}` },
  TEL: { type: 'TEL', value: `${D.mediumPhone}` },
  FIELD: { type: 'FIELD', value: `${D.mediumFaceToFace}` },
};

export const findMediumValueByType = type =>
  Object.values(mediumEnum).filter(value => value.type === type)?.[0]?.value;

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
