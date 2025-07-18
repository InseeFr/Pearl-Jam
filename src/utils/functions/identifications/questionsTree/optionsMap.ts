import D from 'i18n';
import { IdentificationQuestionOptionValues } from 'utils/enum/identifications/IdentificationsQuestions';

export const optionsMap = {
  SAME_ADDRESS: {
    label: `${D.sameAddress}`,
    value: IdentificationQuestionOptionValues.SAME_ADDRESS,
  },
  OTHER_ADDRESS: {
    label: `${D.otherAddress}`,
    value: IdentificationQuestionOptionValues.OTHER_ADDRESS,
  },

  NOFIELD: { label: `${D.noField}`, value: IdentificationQuestionOptionValues.NOFIELD },
  NOIDENT: { label: `${D.noIdent}`, value: IdentificationQuestionOptionValues.NOIDENT },
  DCD: { label: `${D.deceased}`, value: IdentificationQuestionOptionValues.DCD },
  ORDINARY: { label: `${D.situationOrdinary}`, value: IdentificationQuestionOptionValues.ORDINARY },
  NOORDINARY: {
    label: `${D.situationNonOrdinary}`,
    value: IdentificationQuestionOptionValues.NOORDINARY,
  },
  ADDRESS_IDENTIFIED: {
    label: `${D.adressIdentified}`,
    value: IdentificationQuestionOptionValues.IDENTIFIED,
  },
  ADRESS_UNIDENTIFIED: {
    label: `${D.adressUnidentified}`,
    value: IdentificationQuestionOptionValues.UNIDENTIFIED,
  },
  ADRESS_DESTROYED: {
    label: `${D.adressDestroyed}`,
    value: IdentificationQuestionOptionValues.DESTROY,
  },
  OCCUPANT_IDENTIFIED: {
    label: `${D.occupantIdentified}`,
    value: IdentificationQuestionOptionValues.IDENTIFIED,
  },
  OCCUPANT_UNIDENTIFIED: {
    label: `${D.occupantUnidentified}`,
    value: IdentificationQuestionOptionValues.UNIDENTIFIED,
  },
  ACC: { label: `${D.accessibleIdentifiedHousing}`, value: IdentificationQuestionOptionValues.ACC },
  NACC: {
    label: `${D.notAccessibleIdentifiedHousing}`,
    value: IdentificationQuestionOptionValues.NACC,
  },
  ABSORBED: { label: `${D.situationAbsorbed}`, value: IdentificationQuestionOptionValues.ABSORBED },
  PRIMARY: { label: `${D.categoryPrimary}`, value: IdentificationQuestionOptionValues.PRIMARY },
  SECONDARY: {
    label: `${D.categorySecondary}`,
    value: IdentificationQuestionOptionValues.SECONDARY,
  },
  OCCASIONAL: {
    label: `${D.categoryOccasional}`,
    value: IdentificationQuestionOptionValues.OCCASIONAL,
  },
  VACANT: { label: `${D.categoryVacant}`, value: IdentificationQuestionOptionValues.VACANT },
  ONE: { label: `${D.oneRespondent}`, value: IdentificationQuestionOptionValues.ONE },
  MANY: { label: `${D.manyRespondents}`, value: IdentificationQuestionOptionValues.MANY },
  SAME_COMPO: {
    label: `${D.sameHouseHoldComposition}`,
    value: IdentificationQuestionOptionValues.SAME_COMPO,
  },
  OTHER_COMPO: {
    label: `${D.otherHouseHoldComposition}`,
    value: IdentificationQuestionOptionValues.OTHER_COMPO,
  },
  NONE: {
    label: `${D.noOnePresentInPreviousHome}`,
    value: IdentificationQuestionOptionValues.NONE,
  },
  AT_LEAST_ONE: {
    label: `${D.atLeastOnePresentInPreviousHome}`,
    value: IdentificationQuestionOptionValues.AT_LEAST_ONE,
  },
  TREAT: {
    label: `${D.treat}`,
    value: IdentificationQuestionOptionValues.YES,
  },
  NOTREAT: {
    label: `${D.noTreat}`,
    value: IdentificationQuestionOptionValues.NO,
  },
};
