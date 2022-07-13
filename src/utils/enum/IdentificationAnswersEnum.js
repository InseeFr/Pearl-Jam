import D from 'i18n';

export const identificationAnswersEnum = {
  IDENTIFICATION_IDENTIFIED: {
    type: 'IDENTIFICATION_IDENTIFIED',
    value: 'IDENTIFIED',
    label: `${D.identificationIdentified}`,
  },
  IDENTIFICATION_UNIDENTIFIED: {
    type: 'IDENTIFICATION_UNIDENTIFIED',
    value: 'UNIDENTIFIED',
    label: `${D.identificationUnidentified}`,
  },
  IDENTIFICATION_DESTROYED: {
    type: 'IDENTIFICATION_DESTROYED',
    value: 'DESTROYED',
    label: `${D.identificationDestroy}`,
  },
  ACCESS_ACC: { type: 'ACCESS_ACC', value: 'ACC', label: `${D.accessAccessible}` },
  ACCESS_NAC: { type: 'ACCESS_NAC', value: 'NACC', label: `${D.accessNotAccessible}` },
  SITUATION_ORDINARY: {
    type: 'SITUATION_ORDINARY',
    value: 'ORDINARY',
    label: `${D.situationOrdinary}`,
  },
  SITUATION_NORDINARY: {
    type: 'SITUATION_NORDINARY',
    value: 'NORDINARY',
    label: `${D.situationNotOrdinary}`,
  },
  SITUATION_ABSORBED: {
    type: 'SITUATION_ABSORBED',
    value: 'ABSORBED',
    label: `${D.situationAbsorbed}`,
  },
  CATEGORY_PRIMARY: { type: 'CATEGORY_PRIMARY', value: 'PRIMARY', label: `${D.categoryPrimary}` },
  CATEGORY_SECONDARY: {
    type: 'CATEGORY_SECONDARY',
    value: 'SECONDARY',
    label: `${D.categorySecondary}`,
  },
  CATEGORY_OCCASIONAL: {
    type: 'CATEGORY_OCCASIONAL',
    value: 'OCCASIONAL',
    label: `${D.categoryOccasional}`,
  },
  CATEGORY_VACANT: { type: 'CATEGORY_VACANT', value: 'VACANT', label: `${D.categoryVacant}` },
  CATEGORY_DK: { type: 'CATEGORY_DK', value: 'DK', label: `${D.categoryDontKnow}` },
  OCCUPANT_IDENTIFIED: {
    type: 'OCCUPANT_IDENTIFIED',
    value: 'IDENTIFIED',
    label: `${D.occupantIdentified}`,
  },
  OCCUPANT_UNIDENTIFIED: {
    type: 'OCCUPANT_UNIDENTIFIED',
    value: 'UNIDENTIFIED',
    label: `${D.occupantUnidentified}`,
  },
};

export const findIdentificationAnswerValueByType = type =>
  Object.values(identificationAnswersEnum).filter(value => value.type === type)?.[0]?.value;
