import D from 'i18n';

export const identificationAnswerTypeEnum = {
  IDENTIFICATION: 'IDENTIFICATION',
  ACCESS: 'ACCESS',
  SITUATION: 'SITUATION',
  CATEGORY: 'CATEGORY',
  OCCUPANT: 'OCCUPANT',
};

export const identificationAnswersEnum = {
  IDENTIFICATION_IDENTIFIED: {
    questionType: identificationAnswerTypeEnum.IDENTIFICATION,
    type: 'IDENTIFICATION_IDENTIFIED',
    value: 'IDENTIFIED',
    label: `${D.identificationIdentified}`,
    concluding: false,
  },
  IDENTIFICATION_UNIDENTIFIED: {
    questionType: identificationAnswerTypeEnum.IDENTIFICATION,
    type: 'IDENTIFICATION_UNIDENTIFIED',
    value: 'UNIDENTIFIED',
    label: `${D.identificationUnidentified}`,
    concluding: true,
  },
  IDENTIFICATION_DESTROYED: {
    type: 'IDENTIFICATION_DESTROYED',
    value: 'DESTROYED',
    label: `${D.identificationDestroy}`,
    concluding: true,
  },
  ACCESS_ACC: {
    questionType: identificationAnswerTypeEnum.ACCESS,
    type: 'ACCESS_ACC',
    value: 'ACC',
    label: `${D.accessAccessible}`,
    concluding: false,
  },
  ACCESS_NAC: {
    questionType: identificationAnswerTypeEnum.ACCESS,
    type: 'ACCESS_NAC',
    value: 'NACC',
    label: `${D.accessNotAccessible}`,
    concluding: false,
  },
  SITUATION_ORDINARY: {
    questionType: identificationAnswerTypeEnum.SITUATION,
    type: 'SITUATION_ORDINARY',
    value: 'ORDINARY',
    label: `${D.situationOrdinary}`,
    concluding: false,
  },
  SITUATION_NORDINARY: {
    questionType: identificationAnswerTypeEnum.SITUATION,
    type: 'SITUATION_NORDINARY',
    value: 'NORDINARY',
    label: `${D.situationNotOrdinary}`,
    concluding: true,
  },
  SITUATION_ABSORBED: {
    questionType: identificationAnswerTypeEnum.SITUATION,
    type: 'SITUATION_ABSORBED',
    value: 'ABSORBED',
    label: `${D.situationAbsorbed}`,
    concluding: true,
  },
  CATEGORY_PRIMARY: {
    questionType: identificationAnswerTypeEnum.CATEGORY,
    type: 'CATEGORY_PRIMARY',
    value: 'PRIMARY',
    label: `${D.categoryPrimary}`,
    concluding: false,
  },
  CATEGORY_SECONDARY: {
    questionType: identificationAnswerTypeEnum.CATEGORY,
    type: 'CATEGORY_SECONDARY',
    value: 'SECONDARY',
    label: `${D.categorySecondary}`,
    concluding: true,
  },
  CATEGORY_OCCASIONAL: {
    questionType: identificationAnswerTypeEnum.CATEGORY,
    type: 'CATEGORY_OCCASIONAL',
    value: 'OCCASIONAL',
    label: `${D.categoryOccasional}`,
    concluding: false,
  },
  CATEGORY_VACANT: {
    questionType: identificationAnswerTypeEnum.CATEGORY,
    type: 'CATEGORY_VACANT',
    value: 'VACANT',
    label: `${D.categoryVacant}`,
    concluding: true,
  },
  CATEGORY_DK: {
    questionType: identificationAnswerTypeEnum.CATEGORY,
    type: 'CATEGORY_DK',
    value: 'DK',
    label: `${D.categoryDontKnow}`,
    concluding: false,
  },
  OCCUPANT_IDENTIFIED: {
    questionType: identificationAnswerTypeEnum.OCCUPANT,
    type: 'OCCUPANT_IDENTIFIED',
    value: 'IDENTIFIED',
    label: `${D.occupantIdentified}`,
    concluding: true,
  },
  OCCUPANT_UNIDENTIFIED: {
    questionType: identificationAnswerTypeEnum.OCCUPANT,
    type: 'OCCUPANT_UNIDENTIFIED',
    value: 'UNIDENTIFIED',
    label: `${D.occupantUnidentified}`,
    concluding: true,
  },
};

export const findIdentificationAnswerValueByType = type =>
  Object.values(identificationAnswersEnum).filter(value => value.type === type)?.[0]?.value;
