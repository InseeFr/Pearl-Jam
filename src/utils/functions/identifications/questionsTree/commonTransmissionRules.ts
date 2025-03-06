import { TransmissionRules } from '../identificationFunctions';

export const commonTransmissionRules: TransmissionRules = {
  shouldValidIfIdentificationFinished: true,
  invalidIfmissingContactOutcome: true,
  invalidIfmissingContactAttempt: true,
  expectedState: 'WFT',
};
