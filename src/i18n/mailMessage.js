const commonMailMessage = {
  autoMail: {
    fr: `Ceci est un message envoyé automatiquement par l'application suite à une erreur lors de la synchronisation.`,
  },
  subjectTitle: {
    fr: `Problème lors de la synchronisation`,
  },
};

const mailMessage = {
  subjectPearlMissingUnits: {
    fr: `${commonMailMessage.subjectTitle.fr} : Trop d'unités enquêtées`,
    en: 'Home',
  },
  subjectQueenMissingUnits: {
    fr: `${commonMailMessage.subjectTitle.fr} : Il manque des unités enquêtées`,
    en: 'Home',
  },
  subjectTempZone: {
    fr: `${commonMailMessage.subjectTitle.fr} : La sauvegarde des certaines unités enquêtées n'a pas fonctionné correctement`,
  },
  bodyPearlMissingUnits: {
    fr: userId => (pearlMissing = []) => {
      return (
        `Bonjour madame, monsieur. \n\n ` +
        `Pour information, l'utilisateur d'identifant "${userId}" a reçu lors de sa synchronisation, trop d'unités enquêtées pour la partie questionnaire.\n` +
        `Les unités présentes "en trop" sur son poste sont : ${pearlMissing.join(', ')}.\n\n` +
        `Merci.\n\n ${commonMailMessage.autoMail.fr}`
      );
    },
  },
  bodyQueenMissingUnits: {
    fr: userId => (queenMissing = []) => {
      return (
        `Bonjour madame, monsieur. \n\n ` +
        `Pour information, l'utilisateur d'identifant "${userId}" n'a pas reçu lors de sa synchronisation toutes les unités enquêtées dont il a la charge.\n` +
        `Les unités manquantes sur son poste sont : ${queenMissing.join(', ')}.\n` +
        `Par conséquent, l'utilisateur ne peut pas collecter de réponses au questionnaire pour ces unités, l'accès au questionnaire est donc bloqué pour celles-ci.\n\n` +
        `Merci.\n\n ${commonMailMessage.autoMail.fr}`
      );
    },
  },
  bodyTempZonePearl: {
    fr: userId => (tempZoneUnits = []) => {
      return (
        `Bonjour madame, monsieur. \n\n` +
        `Pour information, l'utilisateur d'identifant "${userId}" n'a pas pu sauvegardé correctement certaines unités enquêtées pour un problème de droit.\n` +
        `Les données sont de nature organisationnelle.\n` +
        `Les unités concernées sont : ${tempZoneUnits.join(', ')}.\n` +
        `Ces unités ont donc été sauvegardées dans une zone tampon en attandant un eventuel traitement.\n\n` +
        `Merci de bien en prendre notes, afin de vérifier qu'il ne s'agît pas d'une erreur.\n\n ${commonMailMessage.autoMail.fr}`
      );
    },
  },
  bodyTempZoneQueen: {
    fr: userId => (tempZoneUnits = []) => {
      return (
        `Bonjour madame, monsieur. \n\n` +
        `Pour information, l'utilisateur d'identifant "${userId}" n'a pas pu sauvegardé correctement certaines unités enquêtées pour un problème de droit.\n` +
        `Les données sont de nature questionnaire.\n` +
        `Les unités concernées sont : ${tempZoneUnits.join(', ')}.\n` +
        `Ces unités ont donc été sauvegardées dans une zone tampon en attandant un eventuel traitement.\n\n` +
        `Merci de bien en prendre notes, afin de vérifier qu'il ne s'agît pas d'une erreur.\n\n ${commonMailMessage.autoMail.fr}`
      );
    },
  },
};

export default mailMessage;
