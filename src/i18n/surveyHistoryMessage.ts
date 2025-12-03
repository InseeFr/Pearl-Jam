const surveyHistoryMessage = {
  deleteContactTitle: {
    fr: 'Supprimer une ligne de coordonnées',
    en: 'Delete a contact line',
    sq: 'Fshij një linjë kontakti',
  },
  deleteContactConfirmation: {
    fr: (contactName: string) =>
      `Souhaitez-vous supprimer la ligne contenant les coordonnées de ${contactName} ?`,
    en: (contactName: string) =>
      `Do you want to delete the line containing ${contactName}'s contact information?`,
    sq: (contactName: string) =>
      `Dëshironi të fshini linjën që përmban informacionin e kontaktit të ${contactName}?`,
  },
  cancel: {
    fr: 'Annuler',
    en: 'Cancel',
    sq: 'Anulo',
  },
  confirm: {
    fr: 'Confirmer',
    en: 'Confirm',
    sq: 'Konfirmo',
  },
  save: {
    fr: 'Enregistrer',
    en: 'Save',
    sq: 'Ruaj',
  },
  edit: {
    fr: 'Modifier',
    en: 'Edit',
    sq: 'Ndrysho',
  },
  delete: {
    fr: 'Supprimer',
    en: 'Delete',
    sq: 'Fshij',
  },
  addContact: {
    fr: 'Ajouter un individu',
    en: 'Add a contact',
    sq: 'Shto një kontakt',
  },
  editContactLine: {
    fr: 'Modifier une ligne',
    en: 'Edit a line',
    sq: 'Ndrysho një linjë',
  },
  deleteContactLine: {
    fr: 'Supprimer une ligne',
    en: 'Delete a line',
    sq: 'Fshij një linjë',
  },
  contactPhoneLabel: {
    fr: 'Téléphone Enquêteur',
    en: 'Phone',
    sq: 'Telefoni',
  },
  contactEmailLabel: {
    fr: 'Adresse Mail',
    en: 'Email',
    sq: 'Email',
  },
  contactCivilityLabel: {
    fr: 'Civilité',
    en: 'Civility',
    sq: 'Titulli',
  },
  contactIsMailContactLabel: {
    fr: 'Contact courrier',
    en: 'Mail contact',
    sq: 'Kontakt përmes postës',
  },
  contactSavedSuccess: {
    fr: 'Coordonnées enregistrées',
    en: 'Contact information saved',
    sq: 'Informacioni i kontaktit u ruajt',
  },
  contactDeletedSuccess: {
    fr: 'Coordonnées supprimées',
    en: 'Contact information deleted',
    sq: 'Informacioni i kontaktit u fshi',
  },
  modalTitleAdd: {
    fr: 'Ajouter une ligne de coordonnées',
    en: 'Add a contact line',
    sq: 'Shto një linjë kontakti',
  },
  modalTitleEdit: {
    fr: 'Modifier une ligne de coordonnées',
    en: 'Edit a contact line',
    sq: 'Ndrysho një linjë kontakti',
  },
  editContactMale: {
    fr: 'M',
    en: 'Mr',
    sq: 'Z',
  },
  editContactFemale: {
    fr: 'Mme',
    en: 'Ms',
    sq: 'Znj',
  },
  yes: {
    fr: 'Oui',
    en: 'Yes',
    sq: 'Po',
  },
  no: {
    fr: 'Non',
    en: 'No',
    sq: 'Jo',
  },
  collectTableLastName: {
    fr: 'Nom',
    en: 'Last name',
    sq: 'Mbiemri',
  },
  collectTableFirstName: {
    fr: 'Prénom',
    en: 'First name',
    sq: 'Emri',
  },
  collectTableAge: {
    fr: 'Age',
    en: 'Age',
    sq: 'Mosha',
  },
  preivousCollectTablePanel: {
    fr: 'Individu panel',
    en: 'Panel Contact',
    sq: 'Kontakti i panelit',
  },
  tablePhone: {
    fr: 'Téléphone',
    en: 'Phone',
    sq: 'Telefoni',
  },
  tableEmail: {
    fr: 'Email',
    en: 'Email',
    sq: 'Email',
  },
  tableMailContact: {
    fr: 'Contact courrier',
    en: 'Mail contact',
    sq: 'Kontakt përmes postës',
  },
  comment: {
    fr: 'Commentaire',
    en: 'Comment',
    sq: 'Koment',
  },
  outcomeComment: {
    fr: 'Bilan des contacts :',
    en: 'Outcome comment',
    sq: 'Koment mbi rezultatin',
  },
  compositionPreviousSurvey: {
    fr: 'Composition du ménage :',
    en: 'Household composition :',
    sq: 'Përbërja e familjes :',
  },
  contactLastName: {
    fr: 'Nom',
    en: 'Last name',
    sq: 'Mbiemri',
  },
  contactFirstName: {
    fr: 'Prénom',
    en: 'First name',
    sq: 'Emri',
  },
  contactPhone: {
    fr: 'Téléphone',
    en: 'Phone',
    sq: 'Telefoni',
  },
  contactEmail: {
    fr: 'Email',
    en: 'Email',
    sq: 'Email',
  },
  contactIsMail: {
    fr: 'Contact courrier',
    en: 'Mail contact',
    sq: 'Kontakt përmes postës',
  },
  shouldBeEmail: {
    fr: 'Cette personne sera-t-elle le contact courrier ?',
    en: 'Mail contact',
    sq: 'Kontakt përmes postës',
  },
  previousSurveyInfo: {
    fr: 'Informations de la collecte précédente',
    en: 'Previous collect informations',
    sq: 'Informacionet e mbledhjes së mëparshme',
  },
  MISTER: {
    fr: 'M',
    en: 'Mr',
    sq: 'Z',
  },
  MISS: {
    fr: 'Mme',
    en: 'Ms',
    sq: 'Znj',
  },
  nextSurveyInfo: {
    fr: 'Coordonnées des individus pour la collecte suivante ',
    en: 'Coordinates of individuals for the next collect',
    sq: 'Koordinatat e individëve për mbledhjen e ardhshme',
  },
  previousCollectInterviewerComment: {
    fr: "Commentaire(s) passé(s) de l'enquêteur :",
    en: "Interviewer's comment(s) :",
    sq: 'Komenti i hetuesit',
  },
  modalAddContact: {
    fr: 'Ajouter une ligne de coordonnées',
    en: 'Add new coordinates',
    sq: 'Shtoni koordinata të reja',
  },
  requiredField: {
    fr: 'Champ obligatoire',
    en: 'Required field',
    sq: 'Fushë e detyrueshme',
  },
  invalidPhone: {
    fr: 'Téléphone invalide',
    en: 'Invalid phone',
    sq: 'Telefon i pavlefshëm',
  },
  invalidEmail: {
    fr: 'Adresse email invalide',
    en: 'Invalid email address',
    sq: 'Adresa e emailit është e pavlefshme',
  },
  contactModalPreferedContactContentMessageFirstPart: {
    fr: 'Attention, un seul individu peut être "Contact courrier". Pour identifier',
    en: 'Warning, only one individual can be "Mail contact". To identify',
    sq: 'Kujdes, vetëm një individ mund të jetë "Kontakt përmes postës". Për të identifikuar',
  },
  contactModalPreferedContactContentMessageSecondPart: {
    fr: "comme contact courrier, veuillez d'abord supprimer cette modalité de l'individu",
    en: 'as mail contact, please first remove this status from the individual',
    sq: 'si kontakt përmes postës, ju lutemi hiqni këtë status nga individi',
  },
  contactModalPreferedContactContentMessageUnknownContactName: {
    fr: 'Attention, un seul individu peut être "Contact courrier". Pour identifier cet individu comme contact courrier, veuillez d\'abord supprimer cette modalité de l\'individu',
    en: 'Warning, only one individual can be "Mail contact". To identify this individual as mail contact, please first remove this status from the individual',
    sq: 'Kujdes, vetëm një individ mund të jetë "Kontakt përmes postës". Për të identifikuar këtë individ si kontakt përmes postës, ju lutemi hiqni këtë status nga individi',
  },
  contactModalPreferedContactButton: {
    fr: "J'ai compris",
    en: 'I understand',
    sq: 'E kuptova',
  },
};

export default surveyHistoryMessage;
