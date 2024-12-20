import { IdentificationQuestionsId } from 'utils/enum/identifications/IdentificationsQuestions';
import { IdentificationQuestions } from '../identificationFunctions';
import D from 'i18n';
import { contactOutcomeEnum } from 'utils/enum/ContactOutcomeEnum';

// TODO: refactorer toutes les paires  label: `${D.sameAddress}`, value: 'SAME_ADDRESS' ? (commun pour les autres methodes de reperages)
export const indtelIdentificationQuestionsTree: IdentificationQuestions = {
  [IdentificationQuestionsId.INDIVIDUAL_STATUS]: {
    id: IdentificationQuestionsId.INDIVIDUAL_STATUS,
    nextId: IdentificationQuestionsId.SITUATION,
    text: `${D.housingIdentification}`,
    options: [
      { label: `${D.sameAddress}`, value: 'SAME_ADDRESS', concluding: false },
      { label: `${D.otherAddress}`, value: 'OTHER_ADDRESS', concluding: false },
      { label: `${D.noField}`, value: 'NOFIELD', concluding: true },
      { label: `${D.noIdent}`, value: 'NOIDENT', concluding: true },
      { label: `${D.deceased}`, value: 'DCD', concluding: true },
    ],
  },
  [IdentificationQuestionsId.SITUATION]: {
    id: IdentificationQuestionsId.SITUATION,
    text: `${D.housingSituation}`,
    options: [
      { label: `${D.situationOrdinary}`, value: 'ORDINARY', concluding: true },
      { label: `${D.situationNonOrdinary}`, value: 'NOORDINARY', concluding: true },
    ],
    dependsOn: {
      questionId: IdentificationQuestionsId.INDIVIDUAL_STATUS,
      values: ['SAME_ADDRESS', 'OTHER_ADDRESS'],
    },
  },
} as const;

export type TransmissionsRulesByTel = {
  individualStatus: string;
  situation?: string;
  outcome?: string;
  isValid: boolean;
}[];

// TODO: voir TODO au dessus
export const transmissionRulesByTel: TransmissionsRulesByTel = [
  {
    individualStatus: 'SAME_ADDRESS',
    situation: 'ORDINARY',
    outcome: contactOutcomeEnum.INTERVIEW_ACCEPTED.value,
    isValid: true,
  },
  {
    individualStatus: 'SAME_ADDRESS',
    situation: 'ORDINARY',
    outcome: contactOutcomeEnum.REFUSAL.value,
    isValid: true,
  },
  {
    individualStatus: 'SAME_ADDRESS',
    situation: 'ORDINARY',
    outcome: contactOutcomeEnum.IMPOSSIBLE_TO_REACH.value,
    isValid: false,
  },
  {
    individualStatus: 'OTHER_ADDRESS',
    situation: 'NOORDINARY',
    outcome: contactOutcomeEnum.INTERVIEW_ACCEPTED.value,
    isValid: true,
  },
  { individualStatus: 'NOIDENT', outcome: contactOutcomeEnum.INTERVIEW_ACCEPTED.value, isValid: false },
  {
    individualStatus: 'DCD',
    outcome: contactOutcomeEnum.INTERVIEW_ACCEPTED.value,
    isValid: false,
  },
];
