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
  lastTitle: { fr: 'Êtes vous vraiment sûr ?', en: 'Are you really sure?' },
  mainTitle: { fr: 'Zone dangereuse', en: 'Danger zone' },
  confirmDate: {
    fr: "Entrer la date et l'heure d'aujourd'hui pour confirmer la suppression.",
    en: "Enter today's date and time to confirm deletion.",
  },
  dateError: { fr: "La date ou l'heure est incorrecte.", en: 'The date or time is incorrect.' },
};

export default resetDataMessage;
