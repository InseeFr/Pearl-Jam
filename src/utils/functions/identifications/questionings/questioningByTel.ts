import { IdentificationQuestionsId } from 'utils/enum/identifications/IdentificationsQuestionsRefactored';
import { IdentificationQuestions } from '../identificationFunctionsRefactored';
import D from 'i18n';

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
