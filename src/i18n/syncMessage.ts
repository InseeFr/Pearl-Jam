import { NotificationState } from 'types/pearl';

const syncMessage = {
  simpleSync: { fr: 'Synchronisation', en: 'Synchronization', sq: 'Sinkronizimi' },
  syncResult: {
    fr: 'Résultat de la synchronisation',
    en: 'Result of synchronization',
    sq: 'Rezultati i sinkronizimit',
  },
  syncSuccess: {
    fr: 'La synchronisation a réussi.',
    en: 'Synchronization succeeded.',
    sq: 'Sinkronizimi u realizua me sukses.',
  },
  syncFailure: {
    fr: 'La synchronisation a échoué, veuillez recommencer.',
    en: 'Synchronization has failed, please try again.',
    sq: 'Sinkronizimi dështoi, ju lutemi provoni përsëri.',
  },
  synchronizationInProgress: {
    fr: 'Synchronisation en cours',
    en: 'Synchronization in progress',
    sq: 'Sinkronizimi në progres',
  },
  synchronizationWaiting: {
    fr: 'En attente de synchronisation',
    en: 'Waiting for synchronization.',
    sq: 'Duke pritur për sinkronizim.',
  },
  synchronizationEnding: {
    fr: 'Fin de la synchronisation',
    en: 'End of synchronization.',
    sq: 'Përfundimi i sinkronizimit',
  },

  syncNotStarted: {
    fr: `La synchronisation n'a pas démarré, car le serveur ne répond pas.`,
    en: `The synchronization did not start, because the server does not respond.`,
    sq: `Sinkronizimi nuk filloi, sepse serveri nuk përgjigjet.`,
  },
  titleSync: {
    fr: (type: NotificationState) => {
      if (type === 'success') return `La synchronisation a réussi.`;
      if (type === 'warning') return `Oups, il y a eu quelques soucis lors de la synchronisation.`;
      if (type === 'error') return `La synchronisation a échoué.`;
      return '';
    },
    en: (type: NotificationState) => {
      if (type === 'success') return `The synchronization was successful.`;
      if (type === 'warning') return `Oops, there were some problems during the synchronization`;
      if (type === 'error') return `Synchronization has failed.`;
      return '';
    },
    sq: (type: NotificationState) => {
      if (type === 'success') return `Sinkronizimi u realizua me sukses.`;
      if (type === 'warning') return `Oops, pati disa probleme gjatë sinkronizimit.`;
      if (type === 'error') return `Sinkronizimi dështoi.`;
      return '';
    },
  },
  syncSuccessMessage: {
    fr: `La synchronisation s'est bien passée, vous pouvez continuer à travailler.`,
    en: `The synchronization went well, you can continue working.`,
    sq: `Sinkronizimi shkoi mirë, mund të vazhdoni punën.`,
  },
  warningOrErrorEndMessage: {
    fr: `Nous vous rappelons qu'aucune donnée n'a été perdue. Elles sont déjà enregistrées sur le serveur ou encore sur votre poste.`,
    en: `We remind you that no data has been lost. They are already saved on the server or on your computer.`,
    sq: `Ju kujtojmë se nuk ka të dhëna të humbura. Ato janë tashmë të ruajtura në server ose në kompjuterin tuaj.`,
  },

  syncPleaseTryAgain: {
    fr: `Nous vous invitons à réessayer plus tard. Si ce message persiste, veuillez contacter l'assistance.`,
    en: `Please try again later.. If this message persists, please contact support.`,
    sq: `Ju lutemi provoni përsëri më vonë.. Nëse ky mesazh vazhdon të qëndrojë, ju lutemi kontaktoni ndihmën.`,
  },
  syncYouCanStillWork: {
    fr: `Vous pouvez tout de même continuer à travailler.`,
    en: `You can still continue to work.`,
    sq: `Ju ende mund të vazhdoni të punoni.`,
  },
  syncQueenMissing: {
    fr: `Certains questionnaires ne sont pas accessibles, l'administrateur de l'application a été prévenu.`,
    en: `Some questionnaires are not accessible, the application administrator has been notified.`,
    sq: `Disa anketarë nuk janë të arritshëm, administratori i aplikacionit është njoftuar.`,
  },
  syncPearlMissing: {
    fr: `Pour information, vous avez "trop" de données de niveau questionnaire si votre poste,. Cela n'est en rien bloquant. L'administrateur de l'application a été prévenu.`,
    en: `For your information, you have "too much" questionnaire level data if your post,. This is not blocking anything. The application administrator has been notified.`,
    sq: `Për informacion, ju keni "shumë" të dhëna në nivelin e anketës nëse postimi juaj. Kjo nuk bllokon asgjë. Administratori i aplikacionit është njoftuar.`,
  },
  webTerminatedSurveyUnit: {
    fr: (su: number) =>
      `Nombre d’unités terminées sur internet depuis la dernière synchronisation: ${su}`,
    en: (su: number) => `Number of units completed online since the last synchronization:: ${su}`,
    sq: (su: number) =>
      `Numri i njësive të përfunduara në internet që nga sinkronizimi i fundit: ${su}`,
  },
  webInitSurveyUnit: {
    fr: (su: number) =>
      `Nombre d’unités démarrées sur internet depuis la dernière synchronisation: ${su}`,
    en: (su: number) => `Number of units started online since the last synchronization: ${su}`,
    sq: (su: number) => `Numri i njësive të nisura në internet që nga sinkronizimi i fundit: ${su}`,
  },
  syncNoPearlData: {
    fr: `Pour information, vous n'avez récupéré aucune données.`,
    en: `For your information, you have not retrieved any data.`,
    sq: `Për informacion, ju nuk keni nxjerrë asnjë të dhënë.`,
  },
  syncStopOnError: {
    fr: `La synchronisation s'est arrêtée.`,
    en: `The synchronization has stopped.`,
    sq: `Sinkronizimi është ndalur.`,
  },
  syncTempZone: {
    fr: `Pour information, certaines unités enquêtées n'ont pas pu être sauvegardées correctement pour un problème de droit. Ces unités ont donc été sauvegardées de manière sécurisée ailleurs, en attendant un éventuel traitement. L'administrateur de l'application a été prévenu.`,
    en: `For your information, some of the survey-units could not be saved correctly due to legal issues. These units were therefore saved securely elsewhere, pending further processing. The application administrator has been notified.`,
    sq: `Për informacionin tuaj, disa nga njësitë e anketuara nuk mundën të ruheshin në mënyrë korrekte për shkak të çështjeve ligjore. Këto njësi prandaj u ruajtën në mënyrë të sigurt diku tjetër, në pritje të përpunimit të mëtejshëm. Administratori i aplikacionit është njoftuar.`,
  },
  detailsSync: {
    fr: 'Détails : Bilan de synchronisation',
    en: 'Details : Synchronization report',
    sq: 'Detajet : Raporti i Sinkronizimit',
  },
  transmittedSurveyUnits: {
    fr: (n: number) =>
      n > 1 ? `${n} unités enquêtées transmises` : `${n} unité enquêtée transmise`,
    en: (n: number) => (n > 1 ? `${n} transmitted survey-units` : `${n} transmitted survey-unit`),
    sq: (n: number) =>
      n > 1 ? `${n} njësi anketimi të transmetuara` : `${n} njësi anketimi e transmetuar`,
  },
  loadedSurveyUnits: {
    fr: (n: number) => (n > 1 ? `${n} unités enquêtées chargées` : `${n} unité enquêtée chargée`),
    en: (n: number) => (n > 1 ? `${n} loaded survey-units` : `${n} loaded survey-unit`),
    sq: (n: number) =>
      n > 1 ? `${n} njësi anketimi të ngarkuara` : `${n} njësi anketimi e ngarkuar`,
  },
  nothingToDisplay: {
    fr: 'Rien à afficher',
    en: 'Nothing to display',
    sq: 'Asnjë gjë për të shfaqur',
  },
};

export default syncMessage;
