import D from 'i18n';

export const mediumEnum = {
  EMAIL: { value: 'EMAIL', label: `${D.mediumEmail}` },
  TEL: { value: 'TEL', label: `${D.mediumPhone}` },
  FIELD: { value: 'FIELD', label: `${D.mediumFaceToFace}` },
} as const;

export const findMediumLabelByValue = (value: string) =>
  Object.values(mediumEnum).filter(medium => medium.value === value)?.[0]?.label;

export const getMediumByConfiguration = (configuration: string) => {
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
