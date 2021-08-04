const syncMessage = {
  syncResult: { fr: 'Résultat de la synchronisation', en: 'Result of synchronization' },
  syncSuccess: { fr: 'La synchronisation a réussi.', en: 'Synchronization succeeded.' },
  syncFailure: {
    fr: 'La synchronisation a échoué, veuillez recommencer.',
    en: 'Synchronization has failed, please try again.',
  },
  noResponseFromServer: {
    fr: 'Le serveur ne répond pas, nous vous invitons à réessayer plus tard',
    en: '',
  },
  titleSync: {
    fr: type => {
      if (type === 'success') return `La synchronsiation a réussi.`;
      if (type === 'warning') return `Oups, il y'a eu quelque soucis lors de la synchronisation`;
      if (type === 'error') return `La synchronisation a échoué.`;
    },
  },
};

export default syncMessage;
