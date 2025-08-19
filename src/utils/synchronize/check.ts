import { NOTIFICATION_TYPE_SYNC, PEARL_USER_KEY } from 'utils/constants';

import { postMailMessage } from 'api/pearl';
import D from 'i18n';
import { NotificationState, SurveyUnit, SyncResultDetails } from 'types/pearl';
import { Notification, SyncReport } from 'utils/indexeddb/idb-config';
import notificationIdbService from 'utils/indexeddb/services/notification-idb-service';
import { surveyUnitIDBService } from 'utils/indexeddb/services/surveyUnit-idb-service';
import surveyUnitMissingIdbService from 'utils/indexeddb/services/surveyUnitMissing-idb-service';
import syncReportIdbService from 'utils/indexeddb/services/syncReport-idb-service';

export const checkSyncResult = (pearlSuccess: string[], queenSuccess: string[]) => {
  if (pearlSuccess && queenSuccess) {
    const queenMissing = pearlSuccess.reduce((_: string[], pearlSU: string) => {
      if (!queenSuccess.includes(pearlSU)) return [..._, pearlSU];
      return _;
    }, []);

    const pearlMissing = queenSuccess.reduce((_: string[], queenSU: string) => {
      if (!pearlSuccess.includes(queenSU)) return [..._, queenSU];
      return _;
    }, []);

    return { queenMissing, pearlMissing };
  }
  return {};
};

export const getNotifFromResult = (
  result: { state: NotificationState; messages: string[] },
  nowDate?: number
): Omit<Notification, 'id'> => {
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

export const getReportFromResult = (
  result: {
    details?: {
      transmittedSurveyUnits: Record<string, string[]>;
      loadedSurveyUnits: Record<string, string[]>;
    };
    state: unknown;
  },
  nowDate = 0
): Partial<SyncReport> => {
  const { details, state } = result;
  if (state !== 'error') {
    const { transmittedSurveyUnits, loadedSurveyUnits } = details!;
    return {
      id: `report-${nowDate}`,
      transmittedSurveyUnits,
      loadedSurveyUnits,
    };
  }
  return { id: `report-${nowDate}` };
};

const getResult = (
  pearlError: string,
  queenError: string,
  pearlMissing: string[] = [],
  queenMissing: string[] = [],
  pearlSurveyUnits: string[] = [],
  pearlTempZone = [],
  queenTempZone = [],
  transmittedSurveyUnits = {},
  loadedSurveyUnits = {},
  startedWeb: {},
  terminatedWeb: {}
): {
  state: NotificationState;
  messages: string[];
  details?: SyncResultDetails;
} => {
  const messages: string[] = [];
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
      details: { transmittedSurveyUnits, loadedSurveyUnits, startedWeb, terminatedWeb },
    };
  }
  return {
    state: 'success',
    messages: [D.syncSuccessMessage],
    details: { transmittedSurveyUnits, loadedSurveyUnits, startedWeb, terminatedWeb },
  };
};

export const analyseResult = async () => {
  const { id: userId } = JSON.parse(window.localStorage.getItem(PEARL_USER_KEY) || '{}');
  const pearlSus: SurveyUnit[] = await surveyUnitIDBService.getAll();
  const pearlSurveyUnitsArray = pearlSus.map(({ id }: { id: string }) => id);
  const {
    error: pearlError,
    surveyUnitsInTempZone: pearlTempZone,
    transmittedSurveyUnits,
    loadedSurveyUnits,
    terminatedWeb,
    startedWeb,
  } = getSavedSyncPearlData() || {};
  const {
    error: queenError,
    surveyUnitsSuccess: queenSurveyUnitsArray,
    surveyUnitsInTempZone: queenTempZone,
  } = getSavedSyncQueenData() || {};

  if (pearlTempZone?.length > 0) {
    const subject = D.subjectTempZone;

    const content = D.bodyTempZonePearl(userId)(pearlTempZone);

    await postMailMessage({ subject, content });
  }
  if (queenTempZone?.length > 0) {
    const subject = D.subjectTempZone;

    const content = D.bodyTempZoneQueen(userId)(queenTempZone);
    await postMailMessage({ subject, content });
  }

  const { pearlMissing, queenMissing } = checkSyncResult(
    pearlSurveyUnitsArray,
    queenSurveyUnitsArray
  );

  if (pearlMissing && pearlMissing.length > 0) {
    const subject = D.subjectPearlMissingUnits;
    const content = D.bodyPearlMissingUnits(userId)(pearlMissing);
    await postMailMessage({ subject, content });
  }
  if (queenMissing && queenMissing.length > 0) {
    const subject = D.subjectQueenMissingUnits;
    const content = D.bodyQueenMissingUnits(userId)(queenMissing);
    // send Mail to assistance (not enough units in queen database)
    await postMailMessage({ subject, content });
    // save missing (exist in Pearl, not in Queen) units in database
    await surveyUnitMissingIdbService.addAll(
      queenMissing.map((id: string) => {
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
    loadedSurveyUnits,
    startedWeb,
    terminatedWeb
  );

  const nowDate = new Date().getTime();
  const notification = getNotifFromResult(result, nowDate);
  await notificationIdbService.addOrUpdateNotif(notification);
  const report = getReportFromResult(result, nowDate);
  await syncReportIdbService.addOrUpdateReport(report);

  return result;
};

export const saveSyncPearlData = (data: unknown) =>
  window.localStorage.setItem('PEARL_SYNC_RESULT', JSON.stringify(data));
export const getSavedSyncPearlData = () =>
  JSON.parse(window.localStorage.getItem('PEARL_SYNC_RESULT') || '{}');
export const getSavedSyncQueenData = () =>
  JSON.parse(window.localStorage.getItem('QUEEN_SYNC_RESULT') || '{}');
