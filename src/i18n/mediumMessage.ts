export const mediumMessage = {
  mediumPhone: {
    fr: 'Téléphone',
    en: 'Phone',
    sq: 'Telefoni',
  },
  mediumFaceToFace: {
    fr: 'Face à face',
    en: 'Face to face',
    sq: 'Ballë për ballë',
  },
  mediumEmail: {
    fr: 'Mail',
    en: 'E-mail',
    sq: 'E-mail',
  },
  mediumQuestion: {
    fr: 'Préciser le moyen de contact',
    en: 'Select contact medium',
    sq: 'Zgjidhni mjetin e kontaktit',
  },
};

export type MediumMessageKey = keyof typeof mediumMessage;
export default mediumMessage;
