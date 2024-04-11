const communicationMessage = {
  sendCommunication: {
    fr: "Envoyer une communication à l'unité enquêtée",
    en: 'Send a communication to the survey unit',
  },
  mediumMail: { fr: 'Courrier', en: 'Mail' },
  mediumEmail: { fr: 'Mail', en: 'E-mail' },
  communicationNotification: { fr: 'Avis', en: 'Notice' },
  communicationReminder: { fr: 'Relance', en: 'Reminder' },
  communicationMotiveRefusal: { fr: 'Refus', en: 'Refusal' },
  communicationMotiveUnreachable: { fr: 'Impossible à joindre', en: 'Unreachable' },
  selectCommunciationRequestMedium: {
    fr: 'Préciser le moyen de contact',
    en: 'Select contact medium',
  },
  selectCommunciationRequestType: {
    fr: "Préciser l'objet de la communication",
    en: 'Select communication object',
  },
  selectCommunciationRequestReason: {
    fr: 'Préciser le motif de relance',
    en: 'Select reminder reason',
  },
  communicationRequestValidation: { fr: 'Confirmation', en: 'Confirmation' },
  communicationSummaryContent: { fr: 'Vous souhaitez envoyer :', en: 'You are about to send :' },
  communicationSummaryRecipientAddress: {
    fr: "A l'adresse suivante :",
    en: 'To the following address :',
  },
  communicationSummaryRecipient: {
    fr: 'Destinataire',
    en: 'Recipient',
  },
  communicationSummaryInterviewerAddress: {
    fr: "Coordonnées de l'enquêteur·rice :",
    en: 'Interviewer contact information :',
  },
  communicationSummaryInterviewer: {
    fr: 'Enquêteur',
    en: 'Interviewer',
  },
  communicationStatusInit: { fr: 'Créé', en: 'Created' },
  communicationStatusReady: { fr: 'Enregistré', en: 'Created' },
  communicationStatusSubmitted: { fr: 'Envoyé', en: 'Submitted' },
  communicationStatusFailed: { fr: 'En échec', en: 'Failed' },
  communicationStatusUndelivered: { fr: 'Pli non délivré', en: 'Undelivered' },
  communicationStatusCancelled: { fr: 'Annulé', en: 'Cancelled' },
  communicationStatusOn: { fr: 'le', en: 'on' },
};
export default communicationMessage;
