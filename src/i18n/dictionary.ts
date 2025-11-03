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
import surveyHistoryMessage from './surveyHistoryMessage';

const dictionary = {
  pageNotFound: {
    fr: 'Page non trouvée',
    en: 'Page not found',
    sq: 'Faqja nuk u gjet',
  },
  pageNotFoundHelp: {
    fr: "Veuillez vérifier l'URL",
    en: 'Please check the URL',
    sq: 'Ju lutemi kontrolloni URL-në',
  },
  welcome: {
    fr: 'Bienvenue',
    en: 'Welcome',
    sq: 'Mirësevini',
  },
  seeSurveyUnit: {
    fr: 'Voir UE',
    en: 'See SU',
    sq: 'Shiko NJ',
  },
  openQuestionnaire: {
    fr: 'Questionnaire',
    en: 'Questionnaire',
    sq: 'Pyetësori',
  },
  accessTheQuestionnaire: {
    fr: 'Accéder au questionnaire',
    en: 'Access the questionnaire',
    sq: 'Aksesoni pyetësorin',
  },
  organizationComment: {
    fr: "Commentaire lié à l'organisation de la collecte",
    en: 'Comment related to the organization of the collection',
    sq: 'Koment në lidhje me organizimin e mbledhjes',
  },
  surveyUnitComment: {
    fr: "Commentaire lié à l'unité enquêtée",
    en: 'Comment related to the survey unit',
    sq: 'Koment në lidhje me njësinë e anketuar',
  },
  connexionOK: {
    fr: 'Connexion OK',
    en: 'Connection ok',
    sq: 'Lidhja OK',
  },
  connexionKO: {
    fr: 'Pas de réseau',
    en: 'No network',
    sq: 'Pa rrjet',
  },
  interviewer: {
    fr: 'Enquêteur',
    en: 'Interviewer',
    sq: 'Intervistues',
  },
  investigatorMessage: {
    fr: 'Commentaire enquêteur',
    en: 'Investigator comment',
    sq: 'Komenti i hetuesit',
  },
  appInstalling: {
    fr: 'Installation, veuillez patientez...',
    en: 'Installation, please wait...',
    sq: 'Instalimi, ju lutemi prisni...',
  },
  updateAvailable: {
    fr: "Une nouvelle version de l'application est disponible et sera utilisée lorsque tous les onglets de cette page seront fermés.",
    en: 'New version of the application is available and will be used when all tabs for this page are closed.',
    sq: 'Një version i ri i aplikacionit është i disponueshëm dhe do të përdoret kur të gjithë skedat e kësaj faqeje të mbyllen.',
  },
  updateInstalled: {
    fr: "L'application a été mise à jour avec succès",
    en: 'The application has been successfully updated',
    sq: 'Aplikacioni është përditësuar me sukses',
  },
  updating: {
    fr: 'Mise à jour en cours',
    en: 'Update in progress',
    sq: 'Përditësimi në progres',
  },
  installError: {
    fr: "Erreur lors de l'installation de l'application",
    en: 'Error during the installation of the application',
    sq: 'Gabim gjatë instalimit të aplikacionit',
  },
  appReadyOffline: {
    fr: "L'application est prête à être utilisée hors ligne. (Pensez à synchroniser vos données avant)",
    en: 'The application is ready to be used offline. (Remember to synchronize your data before)',
    sq: 'Aplikacioni është gati të përdoret jashtë linje. (Kujtoni të sinkronizoni të dhënat tuaja më parë)',
  },
  areYouSure: { fr: 'Êtes-vous sûr ?', en: 'Are you sure ?', sq: 'A jeni i sigurt?' },
  delete: { fr: 'Supprimer', en: 'Delete', sq: 'Fshij' },
  other: { fr: 'Autre', en: 'Other', sq: 'Tjetër' },
  enterComment: {
    fr: 'Saisissez un commentaire...',
    en: 'Enter a comment...',
    sq: 'Shkruani një koment...',
  },

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
  ...surveyHistoryMessage,
};

export default dictionary;
