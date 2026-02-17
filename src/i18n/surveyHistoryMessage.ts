const surveyHistoryMessage = {
  deleteContactTitle: {
    fr: "Supprimer les informations d'un individu",
    en: 'Delete a contact information',
    sq: 'Fshi informacionin e kontaktit',
  },
  deleteContactConfirmation: {
    fr: (contactFullName: string) =>
      `Souhaitez-vous supprimer la ligne contenant les coordonnées de ${contactFullName} ?`,
    en: (contactFullName: string) =>
      `Do you want to delete the line containing ${contactFullName}'s contact information?`,
    sq: (contactFullName: string) =>
      `Dëshironi të fshini linjën që përmban informacionin e kontaktit të ${contactFullName}?`,
  },
  deleteContactAlertPrivilegedContact: {
    fr: (contactFullName: string) =>
      `Attention, pour supprimer les coordonnées de ${contactFullName}, veuillez d'abord choisir un nouveau "Contact courrier" dans le tableau`,
    en: (contactFullName: string) =>
      `Attention, to delete the contact information of ${contactFullName}, please first choose a new "Mail contact" in the table`,
    sq: (contactFullName: string) =>
      `Kujdes, për të fshirë informacionin e kontaktit të ${contactFullName}, ju lutemi të zgjidhni së pari një "Kontakt përmes postës" të ri në tabelë`,
  },
  deleteContactAlertPrivilegedContactAccept: {
    fr: "J'ai compris",
    en: 'I understand',
    sq: 'E kuptova',
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

  addContact: {
    fr: 'Ajouter un individu',
    en: 'Add a contact',
    sq: 'Shto një kontakt',
  },
  importContacts: {
    fr: 'Importer tous les contacts',
    en: 'Import all contacts',
    sq: 'Importon të gjitha kontaktet',
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
    fr: 'Ajouter un individu',
    en: 'Add a contact',
    sq: 'Shto një kontakt',
  },
  contactModalTitleEdit: {
    fr: "Modifier les informations de l'individu",
    en: 'Edit contact information',
    sq: 'Ndrysho informacionin e kontaktit',
  },
  importAlertErrorModalTitle: {
    fr: "Impossible d'importer",
    en: 'Import not possible',
    sq: 'Importimi nuk është i mundur',
  },
  importAlertErrorModalContent: {
    fr: 'Veuillez selectionner un seul numéro de téléphone favori pour',
    en: 'Please select only one preferred phone number for',
    sq: 'Ju lutemi zgjidhni vetëm një numër telefoni të preferuar për',
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
