import { IdentificationQuestionsId } from 'utils/enum/identifications/IdentificationsQuestions';
import { IdentificationQuestions } from '../identificationFunctions';
import D from 'i18n';
import { contactOutcomeEnum } from 'utils/enum/ContactOutcomeEnum';

// TODO: refactorer toutes les paires  label: `${D.sameAddress}`, value: 'SAMEADRESS' ? (commun pour les autres methodes de reperages)
export const identificationQuestionsTel: IdentificationQuestions = {
  [IdentificationQuestionsId.PERSON]: {
    id: IdentificationQuestionsId.PERSON,
    nextId: IdentificationQuestionsId.SITUATION,
    text: `${D.housingIdentification}`,
    options: [
      { label: `${D.sameAddress}`, value: 'SAMEADRESS', concluding: false },
      { label: `${D.otherAddress}`, value: 'OTHERADRESS', concluding: false },
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
      questionId: IdentificationQuestionsId.PERSON,
      values: ['SAMEADRESS', 'OTHERADRESS'],
    },
  },
} as const;

export type TransmissionsRulesByTel = {
  person: string;
  situation?: string;
  outcome?: string;
  isValid: boolean;
}[];

// TODO: voir TODO au dessus
export const transmissionRulesByTel: TransmissionsRulesByTel = [
  {
    person: 'SAMEADRESS',
    situation: 'ORDINARY',
    outcome: contactOutcomeEnum.INTERVIEW_ACCEPTED.value,
    isValid: true,
  },
  {
    person: 'SAMEADRESS',
    situation: 'ORDINARY',
    outcome: contactOutcomeEnum.REFUSAL.value,
    isValid: true,
  },
  {
    person: 'SAMEADRESS',
    situation: 'ORDINARY',
    outcome: contactOutcomeEnum.IMPOSSIBLE_TO_REACH.value,
    isValid: false,
  },
  {
    person: 'OTHERADRESS',
    situation: 'NOORDINARY',
    outcome: contactOutcomeEnum.INTERVIEW_ACCEPTED.value,
    isValid: true,
  },
  { person: 'NOIDENT', outcome: contactOutcomeEnum.INTERVIEW_ACCEPTED.value, isValid: false },
  {
    person: 'DCD',
    outcome: contactOutcomeEnum.INTERVIEW_ACCEPTED.value,
    isValid: false,
  },
];
