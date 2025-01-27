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
  HOUSE_IDENTIFIED: {
    label: `${D.houseIdentified}`,
    value: IdentificationQuestionOptionValues.IDENTIFIED,
  },
  HOUSE_UNIDENTIFIED: {
    label: `${D.houseUnidentified}`,
    value: IdentificationQuestionOptionValues.UNIDENTIFIED,
  },
  OCCUPANT_IDENTIFIED: {
    label: `${D.occupantIdentified}`,
    value: IdentificationQuestionOptionValues.IDENTIFIED,
  },
  OCCUPANT_UNIDENTIFIED: {
    label: `${D.occupantUnidentified}`,
    value: IdentificationQuestionOptionValues.UNIDENTIFIED,
  },
  DESTROY: {
    label: `${D.identificationDestroy}`,
    value: IdentificationQuestionOptionValues.DESTROY,
  },
  ACC: { label: `${D.accessibleHousing}`, value: IdentificationQuestionOptionValues.ACC },
  NACC: { label: `${D.notAccessibleHousing}`, value: IdentificationQuestionOptionValues.NACC },
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
  SAME_HOUSE: { label: `${D.sameHouse}`, value: IdentificationQuestionOptionValues.SAME_HOUSE },
  OTHER_HOUSE: { label: `${D.otherHouse}`, value: IdentificationQuestionOptionValues.OTHER_HOUSE },
  SAME_COMPO: {
    label: `${D.sameHouseHoldComposition}`,
    value: IdentificationQuestionOptionValues.SAME_COMPO,
  },
  OTHER_COMPO: {
    label: `${D.otherHouseHoldComposition}`,
    value: IdentificationQuestionOptionValues.OTHER_COMPO,
  },
  NO_IN_OLD_HOUSE: {
    label: `${D.noOnePresentInPreviousHome}`,
    value: IdentificationQuestionOptionValues.NO_IN_OLD_HOUSE,
  },
  IN_OLD_HOUSE: {
    label: `${D.atLeastOnePresentInPreviousHome}`,
    value: IdentificationQuestionOptionValues.IN_OLD_HOUSE,
  },
};
