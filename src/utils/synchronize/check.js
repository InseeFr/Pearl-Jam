import * as api from 'utils/api';

import { NOTIFICATION_TYPE_SYNC, PEARL_USER_KEY } from 'utils/constants';

import D from 'i18n';
import notificationIdbService from 'utils/indexeddb/services/notification-idb-service';
import surveyUnitIdbService from 'utils/indexeddb/services/surveyUnit-idb-service';
import surveyUnitMissingIdbService from 'utils/indexeddb/services/surveyUnitMissing-idb-service';
import syncReportIdbService from 'utils/indexeddb/services/syncReport-idb-service';

export const checkSyncResult = (pearlSuccess, queenSuccess) => {
  if (pearlSuccess && queenSuccess) {
    const queenMissing = pearlSuccess.reduce((_, pearlSU) => {
      if (!queenSuccess.includes(pearlSU)) return [..._, pearlSU];
      return _;
    }, []);

    const pearlMissing = queenSuccess.reduce((_, queenSU) => {
      if (!pearlSuccess.includes(queenSU)) return [..._, queenSU];
      return _;
    }, []);

    return { queenMissing, pearlMissing };
  }
  return {};
};

export const getNotifFromResult = (result, nowDate) => {
  const { state, messages } = result;
  return {
    date: nowDate || new Date().getTime(),
    type: NOTIFICATION_TYPE_SYNC,
    title: D.titleSync(state),
    messages,
    state,
    read: false,
    detail: `report-${nowDate}`,
  };
};

export const getReportFromResult = (result, nowDate = 0) => {
  const { details, state } = result;
  if (state !== 'error') {
    const { transmittedSurveyUnits, loadedSurveyUnits } = details;
    return {
      id: `report-${nowDate}`,
      transmittedSurveyUnits,
      loadedSurveyUnits,
    };
  }
  return { id: `report-${nowDate}` };
};

const getResult = (
  pearlError,
  queenError,
  pearlMissing = [],
  queenMissing = [],
  pearlSurveyUnits = [],
  pearlTempZone = [],
  queenTempZone = [],
  transmittedSurveyUnits = {},
  loadedSurveyUnits = {}
) => {
  const messages = [];
  if (pearlError || queenError) {
    return {
      state: 'error',
      messages: [D.syncStopOnError, D.warningOrErrorEndMessage, D.syncPleaseTryAgain],
    };
  }
  if (
    pearlTempZone.length > 0 ||
    queenTempZone.length > 0 ||
    pearlMissing.length > 0 ||
    queenMissing.length > 0
  ) {
    if (pearlTempZone.length > 0 || queenTempZone.length > 0) messages.push(D.syncTempZone);
    if (queenMissing.length > 0) messages.push(D.syncQueenMissing);
    if (pearlMissing.length > 0) {
      if (pearlSurveyUnits.length === 0) messages.push(D.syncNoPearlData);
      else messages.push(D.syncPearlMissing);
    }

    return {
      state: 'warning',
      messages: [...messages, D.warningOrErrorEndMessage, D.syncYouCanStillWork],
      details: { transmittedSurveyUnits, loadedSurveyUnits },
    };
  }
  return {
    state: 'success',
    messages: [D.syncSuccessMessage],
    details: { transmittedSurveyUnits, loadedSurveyUnits },
  };
};

export const analyseResult = async (PEARL_API_URL, PEARL_AUTHENTICATION_MODE) => {
  const { id: userId } = JSON.parse(window.localStorage.getItem(PEARL_USER_KEY)) || {};
  const pearlSus = await surveyUnitIdbService.getAll();
  const pearlSurveyUnitsArray = pearlSus.map(({ id }) => id);
  const {
    error: pearlError,
    surveyUnitsInTempZone: pearlTempZone,
    transmittedSurveyUnits,
    loadedSurveyUnits,
  } = getSavedSyncPearlData() || {};
  const {
    error: queenError,
    surveyUnitsSuccess: queenSurveyUnitsArray,
    surveyUnitsInTempZone: queenTempZone,
  } = getSavedSyncQueenData() || {};

  if (pearlTempZone && pearlTempZone.length > 0) {
    const mailSubjectToSend = D.subjectTempZone;

    const mailBodyToSend = D.bodyTempZonePearl(userId)(pearlTempZone);
    await api.sendMail(PEARL_API_URL, PEARL_AUTHENTICATION_MODE)(mailSubjectToSend, mailBodyToSend);
  }
  if (queenTempZone && queenTempZone.length > 0) {
    const mailSubjectToSend = D.subjectTempZone;

    const mailBodyToSend = D.bodyTempZoneQueen(userId)(queenTempZone);
    await api.sendMail(PEARL_API_URL, PEARL_AUTHENTICATION_MODE)(mailSubjectToSend, mailBodyToSend);
  }

  const { pearlMissing, queenMissing } = checkSyncResult(
    pearlSurveyUnitsArray,
    queenSurveyUnitsArray
  );

  if (pearlMissing && pearlMissing.length > 0) {
    const mailSubject = D.subjectPearlMissingUnits;
    const mailContent = D.bodyPearlMissingUnits(userId)(pearlMissing);
    // send Mail to assistance (too many units in queen database)
    await api.sendMail(PEARL_API_URL, PEARL_AUTHENTICATION_MODE)(mailSubject, mailContent);
  }
  if (queenMissing && queenMissing.length > 0) {
    const mailSubject = D.subjectQueenMissingUnits;
    const mailContent = D.bodyQueenMissingUnits(userId)(queenMissing);
    // send Mail to assistance (not enough units in queen database)
    await api.sendMail(PEARL_API_URL, PEARL_AUTHENTICATION_MODE)(mailSubject, mailContent);
    // save missing (exist in Pearl, not in Queen) units in database
    await surveyUnitMissingIdbService.addAll(
      queenMissing.map(id => {
        return { id };
      })
    );
  }

  const result = getResult(
    pearlError,
    queenError,
    pearlMissing,
    queenMissing,
    pearlSurveyUnitsArray,
    pearlTempZone,
    queenTempZone,
    transmittedSurveyUnits,
    loadedSurveyUnits
  );

  const nowDate = new Date().getTime();
  const notification = getNotifFromResult(result, nowDate);
  await notificationIdbService.addOrUpdateNotif(notification);
  const report = getReportFromResult(result, nowDate);
  await syncReportIdbService.addOrUpdateReport(report);

  return result;
};

export const saveSyncPearlData = data =>
  window.localStorage.setItem('PEARL_SYNC_RESULT', JSON.stringify(data));
export const getSavedSyncPearlData = () =>
  JSON.parse(window.localStorage.getItem('PEARL_SYNC_RESULT') || '{}');
export const getSavedSyncQueenData = () =>
  JSON.parse(window.localStorage.getItem('QUEEN_SYNC_RESULT') || '{}');
