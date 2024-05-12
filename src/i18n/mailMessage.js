const commonMailMessage = {
  autoMail: {
    fr: `Ceci est un message envoyé automatiquement par l'application suite à une erreur lors de la synchronisation.`,
    en: `This is a message sent automatically by the application following an error during synchronization.`,
    sq: `Ky është një mesazh i dërguar automatikisht nga aplikacioni pas një gabimi gjatë sinkronizimit.`,
  },
  subjectTitle: {
    fr: `Problème lors de la synchronisation`,
    en: `Problem during synchronization`,
    sq: `Problem gjatë sinkronizimit`,
  },
};

const mailMessage = {
  subjectPearlMissingUnits: {
    fr: `${commonMailMessage.subjectTitle.fr} : Trop d'unités enquêtées`,
    en: `${commonMailMessage.subjectTitle.en} : Too many survey-units`,
    sq: `${commonMailMessage.subjectTitle.sq} : Shumë njësi hetimi`,
  },
  subjectQueenMissingUnits: {
    fr: `${commonMailMessage.subjectTitle.fr} : Il manque des unités enquêtées`,
    en: `${commonMailMessage.subjectTitle.en} : Survey-units are missing`,
    sq: `${commonMailMessage.subjectTitle.sq} : Mungojnë njësitë e hetimit`,
  },
  subjectTempZone: {
    fr: `${commonMailMessage.subjectTitle.fr} : La sauvegarde des certaines unités enquêtées n'a pas fonctionné correctement`,
    en: `${commonMailMessage.subjectTitle.en} : The backup of some surveyed units did not work properly.`,
    sq: `${commonMailMessage.subjectTitle.sq} : Ruajtja e disa njësive të hetimit nuk funksionoi si duhet`,
  },
  bodyPearlMissingUnits: {
    fr:
      userId =>
      (pearlMissing = []) => {
        return (
          `Bonjour Madame, Monsieur. \n\n ` +
          `Pour information, l'utilisateur d'identifant "${userId}" a reçu lors de sa synchronisation, trop d'unités enquêtées pour la partie questionnaire.\n` +
          `Les unités présentes "en trop" sur son poste sont : ${pearlMissing.join(', ')}.\n\n` +
          `Merci.\n\n ${commonMailMessage.autoMail.fr}`
        );
      },
    en:
      userId =>
      (pearlMissing = []) => {
        return (
          `Hello. \n\n ` +
          `For information, the user of identifier "${userId}" received during its synchronization, too many survey-units for the questionnaire part.\n` +
          `The units present "in excess" on his computer are : ${pearlMissing.join(', ')}.\n\n` +
          `Thank you.\n\n ${commonMailMessage.autoMail.en}`
        );
      },
    sq:
      userId =>
      (pearlMissing = []) => {
        return (
          `Përshëndetje. \n\n ` +
          `Për informacion, përdoruesi me identifikatorin "${userId}" ka marrë gjatë sinkronizimit, shumë njësi hetimi për pjesën e pyetësorit.\n` +
          `Njësitë e pranishme "në tepër" në kompjuterin e tij/jetës janë : ${pearlMissing.join(', ')}.\n\n` +
          `Faleminderit.\n\n ${commonMailMessage.autoMail.sq}`
        );
      },
  },
  // Add translations for other message bodies similarly
};

export default mailMessage;
