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
  IDENTIFIED: {
    label: `${D.identificationIdentified}`,
    value: IdentificationQuestionOptionValues.IDENTIFIED,
  },
  UNIDENTIFIED: {
    label: `${D.identificationUnidentified}`,
    value: IdentificationQuestionOptionValues.UNIDENTIFIED,
  },
  DESTROY: {
    label: `${D.identificationDestroy}`,
    value: IdentificationQuestionOptionValues.DESTROY,
  },
  ACC: { label: `${D.accessibleHousing}`, value: IdentificationQuestionOptionValues.ACC },
  NACC: { label: `${D.notAccessibleHousing}`, value: IdentificationQuestionOptionValues.NACC },
  ABSORBED: { label: `${D.situationAbsorbed}`, value: IdentificationQuestionOptionValues.ABSORBED },
};
