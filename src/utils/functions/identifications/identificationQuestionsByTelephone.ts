import {
  IdentificationPersonOption,
  IdentificationSituationOption,
} from 'utils/enum/identifications/IdenitifcationsByTelQuestions';

export type IdentificationQuestionOption = { value: string; label?: string };

export type IdentificationQuestion = {
  id: string;
  text: string;
  concluding: boolean;
  options: IdentificationQuestionOption[];
  dependsOn?: { questionId: string; values: string[] };
};

export const questions: IdentificationQuestion[] = [
  {
    id: 'identification.individu',
    text: 'Individu retrouvé',
    concluding: false,
    options: [
      { label: IdentificationPersonOption.SAMEADRESS, value: 'SAMEADRESS' },
      { label: IdentificationPersonOption.OTHERADRESS, value: 'OTHERADRESS' },
      { label: IdentificationPersonOption.NOFIELD, value: 'NOFIELD' },
      { label: IdentificationPersonOption.NOIDENT, value: 'NOIDENT' },
      { label: IdentificationPersonOption.DCD, value: 'DCD' },
    ],
  },
  {
    id: 'identification.situation',
    text: 'Situation du logement',
    concluding: true,
    options: [
      { label: IdentificationSituationOption.NOORDINARY, value: 'NOORDINARY' },
      { label: IdentificationSituationOption.ORDINARY, value: 'ORDINARY' },
    ],
    dependsOn: { questionId: 'identification.individu', values: ['SAMEADRESS', 'OTHERADRESS'] },
  },
];

export function hasDependency(
  question: IdentificationQuestion,
  dependancyOption?: IdentificationQuestionOption
): boolean {
  console.log(question.text);
  console.log(question);
  console.log(dependancyOption);

  if (!question.dependsOn) return true;
  if (!dependancyOption) return false;

  return question.dependsOn.values.some(v => v === dependancyOption.value) ?? false;
}
