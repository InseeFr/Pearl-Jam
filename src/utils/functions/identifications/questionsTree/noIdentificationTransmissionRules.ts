import {
  IdentificationQuestionsId,
  IdentificationQuestionOptionValues,
} from 'utils/enum/identifications/IdentificationsQuestions';
import { TransmissionRules } from '../identificationFunctions';

export const transmissionRulesNoIdentification: TransmissionRules = {
  invalidIfmissingContactOutcome: true,
  invalidIfmissingContactAttempt: true,
  invalidStateAndContactOutcome: { state: 'WFT' },
};
