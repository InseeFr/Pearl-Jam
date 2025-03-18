import { TransmissionRules } from '../identificationFunctions';
import { commonTransmissionRules } from './commonTransmissionRules';

export const transmissionRulesNoIdentification: TransmissionRules = {
  ...commonTransmissionRules,
  shouldValidIfIdentificationFinished: false,
};
