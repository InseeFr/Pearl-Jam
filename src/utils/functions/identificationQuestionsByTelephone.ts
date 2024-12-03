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
      { label: "Oui, à l'adresse indiquée", value: 'SAMEADRESS' },
      {
        label: 'Oui, mais à une autre adresse située dans le champs géographique',
        value: 'OTHERADRESS',
      },
      { label: 'Oui, mais hors du champs géographique', value: 'NOFIELD' },
      { label: 'Non', value: 'NOIDENT' },
      { label: 'Décédé', value: 'DCD' },
    ],
  },
  {
    id: 'identification.situation',
    text: 'Situation du logement',
    concluding: true,
    options: [
      { label: 'Non Ordinaire', value: 'NOORDINARY' },
      { label: 'Ordinaire', value: 'ORDINARY' },
    ],
    dependsOn: { questionId: 'identification.individu', values: ['SAMEADRESS', 'OTHERADRESS'] },
  },
];
