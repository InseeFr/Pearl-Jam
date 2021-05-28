import addressMessage from './addressMessage';
import ageGroupsMessage from './ageGroupsMessage';
import buttonMessage from './buttonMessage';
import contactAttemptMessage from './contactAttemptMessage';
import contactOutcomeMessage from './contactOutcomeMessage';
import criteriaMessage from './criteriaMessage';
import detailsMessage from './detailsMessage';
import errorMessage from './errorMessage';
import navigationMessage from './navigationMessage';
import phoneSourceMessage from './phoneSourceMessage';
import questionnaireStateMessage from './questionnaireStateMessage';
import searchMessage from './searchMessage';
import surveyUnitMessage from './surveyUnitMessage';
import suStateMessage from './suStateMessage';
import tableHeader from './tableHeaderMessage';
import titleMessage from './titleMessage';
import toDoMessage from './toDoMessage';
import transmissionMessage from './transmissionMessage';
import waitingMessage from './waitingMessage';

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
  syncResult: { fr: 'Résultat de la synchronisation', en: 'Result of synchronization' },
  syncSuccess: { fr: 'La synchronisation a réussi.', en: 'Synchronization succeeded.' },
  syncFailure: {
    fr: 'La synchronisation a échoué, veuillez recommencer.',
    en: 'Synchronization has failed, please try again.',
  },
  appInstalling: { fr: 'Installation, veuillez patientez...', en: 'Installation, please wait...' },
  updateAvailable: {
    fr:
      "Une nouvelle version de l'application est disponible et sera utilisée lorsque tous les onglets de cette page seront fermés.",
    en:
      'New version of the application is available and will be used when all tabs for this page are closed.',
  },
  appReadyOffline: {
    fr:
      "L'application est prête à être utilisée hors ligne. (Pensez à synchroniser vos données avant)",
    en: 'The application is ready to be used offline. (Remember to synchronize your data before)',
  },
  areYouSure: { fr: 'Êtes-vous sûr ?', en: 'Are you sure ?' },
  delete: { fr: 'Supprimer', en: 'Delete' },
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
  ...ageGroupsMessage,
  ...titleMessage,
  ...phoneSourceMessage,
};

export default dictionary;
