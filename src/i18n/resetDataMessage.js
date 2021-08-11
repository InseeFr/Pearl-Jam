const resetDataMessage = {
  deleting: { fr: 'Suppression ...', en: 'Deleting ...' },
  deleteSuccess: {
    fr: 'Toutes les données ont bien été supprimées.',
    en: 'All data has been deleted.',
  },
  deleteFailed: {
    fr: 'Il y a eu un problème lors de la suppression des données.',
    en: 'There was a problem when deleting the data.',
  },
  youCanDeleteData: {
    fr: 'Vous pouvez ici vider la base de données local de votre navigateur.',
    en: 'Here you can empty the local database of your browser.',
  },
  firstBodyDialog: {
    fr:
      "Vous allez perdre l'ensemble de vos données. Assurez vous que vos données sont déjà sauvegardées (par une synchronisation ou autre). Êtes vous sûr(e) de vouloir tout supprimer ?",
    en:
      'You will lose all your data. Make sure your data is already backed up (by a synchronization or otherwise). Are you sure you want to delete everything ?',
  },
  secondBodyDialog: { fr: 'Dernier avertissement !', en: 'Last warning!' },
  lastTitle: { fr: 'Êtes vous vraiment sûr(e) ?', en: 'Are you really sure?' },
  mainTitle: { fr: 'Zone dangereuse', en: 'Danger zone' },
  confirmTitle: { fr: 'Confirmation', en: 'Confirmation' },
  confirmRandom: {
    fr: 'Veuillez entrer le texte ci dessous pour confirmer la suppression.',
    en: 'Please enter the text below to confirm the deletion.',
  },
  confirmError: {
    fr: 'La saisie ne correspond pas avec le texte ci-dessus.',
    en: 'The entry does not match the text above.',
  },
};

export default resetDataMessage;
