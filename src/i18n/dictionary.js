import addressMessage from './addressMessage';
import buttonMessage from './buttonMessage';
import communicationMessage from './communicationMessage';
import contactAttemptMessage from './contactAttemptMessage';
import contactOutcomeMessage from './contactOutcomeMessage';
import criteriaMessage from './criteriaMessage';
import detailsMessage from './detailsMessage';
import errorMessage from './errorMessage';
import identificationMessage from './identificationMessage';
import mailMessage from './mailMessage';
import mediumMessage from './mediumMessage';
import navigationMessage from './navigationMessage';
import notificationMessage from './notificationMessage';
import phoneSourceMessage from './phoneSourceMessage';
import questionnaireStateMessage from './questionnaireStateMessage';
import resetDataMessage from './resetDataMessage';
import searchMessage from './searchMessage';
import suStateMessage from './suStateMessage';
import surveyUnitMessage from './surveyUnitMessage';
import syncMessage from './syncMessage';
import tableHeader from './tableHeaderMessage';
import titleMessage from './titleMessage';
import toDoMessage, { stepNames } from './toDoMessage';
import trackingMessage from './trackingMessage';
import transmissionMessage from './transmissionMessage';
import waitingMessage from './waitingMessage';
import profileMessage from './profileMessage';

const dictionary = {
  pageNotFound: {
    fr: 'Page non trouvée',
    en: 'Page not found',
  },
  pageNotFoundHelp: {
    fr: "Veuillez vérifier l'URL",
    en: 'Please check the URL',
  },
  welcome: { fr: 'Bienvenue', en: 'Welcome' },
  seeSurveyUnit: { fr: 'Voir UE', en: 'See SU' },
  openQuestionnaire: { fr: 'Questionnaire', en: 'Questionnaire' },
  accessTheQuestionnaire: { fr: 'Accéder au questionnaire', en: 'Access the questionnaire' },
  organizationComment: {
    fr: "Commentaire lié à l'organisation de la collecte",
    en: 'Comment related to the organization of the collection',
  },
  surveyUnitComment: {
    fr: "Commentaire lié à l'unité enquêtée",
    en: 'Comment related to the survey unit',
  },
  connexionOK: { fr: 'Connexion OK', en: 'Connection ok' },
  connexionKO: { fr: 'Pas de réseau', en: 'No network' },
  interviewer: { fr: 'Enquêteur', en: 'Interviewer' },
  investigatorMessage: { fr: 'Commentaire enquêteur', en: 'Investigator comment' },
  appInstalling: {
    fr: 'Installation, veuillez patientez...',
    en: 'Installation, please wait...',
  },
  updateAvailable: {
    fr: "Une nouvelle version de l'application est disponible et sera utilisée lorsque tous les onglets de cette page seront fermés.",
    en: 'New version of the application is available and will be used when all tabs for this page are closed.',
  },
  updateInstalled: {
    fr: "L'application a été mise à jour avec succès",
    en: 'The application has been successfully updated',
  },
  updating: {
    fr: 'Mise à jour en cours',
    en: 'Update in progress',
  },
  installError: {
    fr: "Erreur lors de l'installation de l'application",
    en: 'Error during the installation of the application',
  },
  appReadyOffline: {
    fr: "L'application est prête à être utilisée hors ligne. (Pensez à synchroniser vos données avant)",
    en: 'The application is ready to be used offline. (Remember to synchronize your data before)',
  },
  areYouSure: { fr: 'Êtes-vous sûr ?', en: 'Are you sure ?' },
  delete: { fr: 'Supprimer', en: 'Delete' },
  other: { fr: 'Autre', en: 'Other' },
  enterComment: { fr: 'Saisissez un commentaire...', en: 'Enter a comment...' },

  ...buttonMessage,
  ...navigationMessage,
  ...waitingMessage,
  ...errorMessage,
  ...tableHeader,
  ...detailsMessage,
  ...toDoMessage,
  ...suStateMessage,
  ...questionnaireStateMessage,
  ...addressMessage,
  ...surveyUnitMessage,
  ...searchMessage,
  ...transmissionMessage,
  ...contactAttemptMessage,
  ...contactOutcomeMessage,
  ...criteriaMessage,
  ...titleMessage,
  ...phoneSourceMessage,
  ...mailMessage,
  ...syncMessage,
  ...notificationMessage,
  ...resetDataMessage,
  ...identificationMessage,
  ...mediumMessage,
  ...communicationMessage,
  ...profileMessage,
  ...stepNames,
  ...trackingMessage,
};

export default dictionary;
