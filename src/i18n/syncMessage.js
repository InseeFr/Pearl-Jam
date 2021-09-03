const syncMessage = {
  simpleSync: { fr: 'Synchronisation', en: 'Synchronization' },
  syncResult: { fr: 'Résultat de la synchronisation', en: 'Result of synchronization' },
  syncSuccess: { fr: 'La synchronisation a réussi.', en: 'Synchronization succeeded.' },
  syncFailure: {
    fr: 'La synchronisation a échoué, veuillez recommencer.',
    en: 'Synchronization has failed, please try again.',
  },
  synchronizationInProgress: { fr: 'Synchronisation en cours', en: 'Synchronization in progress' },
  synchronizationWaiting: {
    fr: 'En attente de synchronisation',
    en: 'Waiting for synchronization.',
  },
  synchronizationEnding: { fr: 'Fin de la synchronisation', en: 'End of synchronization.' },

  syncNotStarted: {
    fr: `La synchronisation n'a pas démarré, car le serveur ne répond pas.`,
    en: `The synchronization did not start, because the server does not respond.`,
  },
  titleSync: {
    fr: type => {
      if (type === 'success') return `La synchronisation a réussi.`;
      if (type === 'warning') return `Oups, il y a eu quelques soucis lors de la synchronisation.`;
      if (type === 'error') return `La synchronisation a échoué.`;
      return '';
    },
    en: type => {
      if (type === 'success') return `The synchronization was successful.`;
      if (type === 'warning') return `Oops, there were some problems during the synchronization`;
      if (type === 'error') return `Synchronization has failed.`;
      return '';
    },
  },
  syncSuccessMessage: {
    fr: `La synchronisation s'est bien passée, vous pouvez continuer à travailler.`,
    en: `The synchronization went well, you can continue working.`,
  },
  warningOrErrorEndMessage: {
    fr: `Nous vous rappelons qu'aucune donnée n'a été perdue. Elles sont déjà enregistrées sur le serveur ou encore sur votre poste.`,
    en: `We remind you that no data has been lost. They are already saved on the server or on your computer.`,
  },

  syncPleaseTryAgain: {
    fr: `Nous vous invitons à réessayer plus tard. Si ce message persiste, veuillez contacter l'assistance.`,
    en: `Please try again later.. If this message persists, please contact support.`,
  },
  syncYouCanStillWork: {
    fr: `Vous pouvez tout de même continuer à travailler.`,
    en: `You can still continue to work.`,
  },
  syncQueenMissing: {
    fr: `Certains questionnaires ne sont pas accessibles, l'administrateur de l'application a été prévenu.`,
    en: `Some questionnaires are not accessible, the application administrator has been notified.`,
  },
  syncPearlMissing: {
    fr: `Pour information, vous avez "trop" de données de niveau questionnaire si votre poste,. Cela n'est en rien bloquant. L'administrateur de l'application a été prévenu.`,
    en: `For your information, you have "too much" questionnaire level data if your post,. This is not blocking anything. The application administrator has been notified.`,
  },
  syncNoPearlData: {
    fr: `Pour information, vous n'avez récupéré aucune données.`,
    en: `For your information, you have not retrieved any data.`,
  },
  syncStopOnError: {
    fr: `La synchronisation s'est arrêtée.`,
    en: `The synchronization has stopped.`,
  },
  syncTempZone: {
    fr: `Pour information, certaines unités enquêtées n'ont pas pu être sauvegardées correctement pour un problème de droit. Ces unités ont donc été sauvegardées de manière sécurisée ailleurs, en attendant un éventuel traitement. L'administrateur de l'application a été prévenu.`,
    en: `For your information, some of the survey-units could not be saved correctly due to legal issues. These units were therefore saved securely elsewhere, pending further processing. The application administrator has been notified.`,
  },
  detailsSync: { fr: 'Détails : Bilan de synchronisation', en: 'Details : Synchronization report' },
  transmittedSurveyUnits: {
    fr: n => (n > 1 ? `${n} unités enquêtées transmises` : `${n} unité enquêtée transmise`),
    en: n => (n > 1 ? `${n} transmitted survey-units` : `${n} transmitted survey-unit`),
  },
  loadedSurveyUnits: {
    fr: n => (n > 1 ? `${n} unités enquêtées chargées` : `${n} unité enquêtée chargée`),
    en: n => (n > 1 ? `${n} loaded survey-units` : `${n} loaded survey-unit`),
  },
  nothingToDisplay: {
    fr: 'Rien à afficher',
    en: 'Nothing to display',
  },
};

export default syncMessage;
