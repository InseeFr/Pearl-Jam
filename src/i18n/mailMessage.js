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
  bodyQueenMissingUnits: {
    fr:
      userId =>
      (queenMissing = []) => {
        return (
          `Bonjour Madame, Monsieur. \n\n ` +
          `Pour information, l'utilisateur d'identifant "${userId}" ne peut pas accéder aux questionnaires de certaines unités enquêtées (Il n'a pas reçu toutes les unités enquêtées dont il a la charge ou il n'a pas reçu les ressources des questionnaires.)\n` +
          `Les unités problématiques sur son poste sont : ${queenMissing.join(', ')}.\n` +
          `Par conséquent, l'utilisateur ne peut pas collecter de réponses au questionnaire pour ces unités, l'accès au questionnaire est donc bloqué pour celles-ci.\n\n` +
          `Merci.\n\n ${commonMailMessage.autoMail.fr}`
        );
      },
    en:
      userId =>
      (queenMissing = []) => {
        return (
          `Hello. \n\n ` +
          `For information, the user of identifier "${userId}" cannot access the questionnaires of some survey-units (He did not receive all the survey-units for which he is responsible or he did not receive the resources for the questionnaires).\n` +
          `The problematic survey-units on his computer are : ${queenMissing.join(', ')}.\n` +
          `Therefore, the user cannot collect questionnaire responses for these units, so access to the questionnaire is blocked for them.\n\n` +
          `Thank you.\n\n ${commonMailMessage.autoMail.en}`
        );
      },
    sq:
      userId =>
      (queenMissing = []) => {
        return (
          `Përshëndetje. \n\n ` +
          `Për informacion, përdoruesi me identifikatorin "${userId}" nuk mund të ketë qasje në pyetësoret e disa njësive hetimore (Nuk ka marrë të gjitha njësitë e hetimit për të cilat është përgjegjës ose nuk ka marrë burimet për pyetësoret).\n` +
          `Njësitë hetimore problematike në kompjuterin e tij/jetës janë : ${queenMissing.join(', ')}.\n` +
          `Prandaj, përdoruesi nuk mund të marrë përgjigje për pyetësoret për këto njësi, kështu që qasja në pyetësor është bllokuar për to.\n\n` +
          `Faleminderit.\n\n ${commonMailMessage.autoMail.sq}`
        );
      },
  },
  bodyTempZonePearl: {
    fr:
      userId =>
      (tempZoneUnits = []) => {
        return (
          `Bonjour Madame, Monsieur. \n\n` +
          `Pour information, l'utilisateur d'identifant "${userId}" n'a pas pu sauvegardé correctement certaines unités enquêtées pour un problème de droit.\n` +
          `Les données sont de nature organisationnelle.\n` +
          `Les unités concernées sont : ${tempZoneUnits.join(', ')}.\n` +
          `Ces unités ont donc été sauvegardées dans une zone tampon en attendant un éventuel traitement.\n\n` +
          `Merci de bien en prendre notes, afin de vérifier qu'il ne s'agît pas d'une erreur.\n\n ${commonMailMessage.autoMail.fr}`
        );
      },
    en:
      userId =>
      (tempZoneUnits = []) => {
        return (
          `Hello. \n\n` +
          `For information, the user of identifier "${userId}" was not able to correctly save some of the survey-units due to a rights issue.\n` +
          `The data is organizational.\n` +
          `The survey-units are : ${tempZoneUnits.join(', ')}.\n` +
          `These units were therefore saved in a buffer zone pending possible treatment.\n\n` +
          `Please take note of it, to make sure it is not a mistake.\n\n ${commonMailMessage.autoMail.en}`
        );
      },
    sq:
      userId =>
      (tempZoneUnits = []) => {
        return (
          `Përshëndetje. \n\n` +
          `Për informacion, përdoruesi me identifikatorin "${userId}" nuk ka mundur të ruajë saktësisht disa nga njësitë hetimore për shkak të një çështje të drejtave.\n` +
          `Të dhënat janë organizative.\n` +
          `Njësitë hetimore janë : ${tempZoneUnits.join(', ')}.\n` +
          `Këto njësi janë kështu që ruajtur në një zonë buffer deri në trajtim të mundshëm.\n\n` +
          `Ju lutemi bëni shënime për këtë, për të siguruar që nuk është një gabim.\n\n ${commonMailMessage.autoMail.sq}`
        );
      },
  },
  bodyTempZoneQueen: {
    fr:
      userId =>
      (tempZoneUnits = []) => {
        return (
          `Bonjour Madame, Monsieur. \n\n` +
          `Pour information, l'utilisateur d'identifant "${userId}" n'a pas pu sauvegardé correctement certaines unités enquêtées pour un problème de droit.\n` +
          `Les données sont de nature questionnaire.\n` +
          `Les unités concernées sont : ${tempZoneUnits.join(', ')}.\n` +
          `Ces unités ont donc été sauvegardées dans une zone tampon en attendant un éventuel traitement.\n\n` +
          `Merci de bien en prendre notes, afin de vérifier qu'il ne s'agît pas d'une erreur.\n\n ${commonMailMessage.autoMail.fr}`
        );
      },
    en:
      userId =>
      (tempZoneUnits = []) => {
        return (
          `Hello. \n\n` +
          `For information, the user of identifier "${userId}" was not able to correctly save some of the survey-units due to a rights issue.\n` +
          `These are questionnaire data.\n` +
          `The survey-units are : ${tempZoneUnits.join(', ')}.\n` +
          `These units were therefore saved in a buffer zone pending possible treatment.\n\n` +
          `Please take note of it, to make sure it is not a mistake.\n\n ${commonMailMessage.autoMail.en}`
        );
      },
    sq:
      userId =>
      (tempZoneUnits = []) => {
        return (
          `Përshëndetje. \n\n` +
          `Për informacion, përdoruesi me identifikatorin "${userId}" nuk ka mundur të ruajë saktësisht disa nga njësitë hetimore për shkak të një çështje të drejtave.\n` +
          `Këto janë të dhënat e pyetësorit.\n` +
          `Njësitë hetimore janë : ${tempZoneUnits.join(', ')}.\n` +
          `Këto njësi janë kështu që ruajtur në një zonë buffer deri në trajtim të mundshëm.\n\n` +
          `Ju lutemi bëni shënime për këtë, për të siguruar që nuk është një gabim.\n\n ${commonMailMessage.autoMail.sq}`
        );
      },
  },
};

export default mailMessage;
