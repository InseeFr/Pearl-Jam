import surveyUnitMissingIdbService from 'indexedbb/services/surveyUnitMissing-idb-service';
import surveyUnitIdbService from 'indexedbb/services/surveyUnit-idb-service';
import { PEARL_USER_KEY } from 'utils/constants';
import * as api from 'utils/api';
import D from 'i18n';

export const checkSyncResult = (pearlSuccess = [], queenSuccess = []) => {
  const queenMissing = pearlSuccess.reduce((_, pearlSU) => {
    if (!queenSuccess.includes(pearlSU)) return [..._, pearlSU];
    return _;
  }, []);

  const pearlMissing = queenSuccess.reduce((_, queenSU) => {
    if (!pearlSuccess.includes(queenSU)) return [..._, queenSU];
    return _;
  }, []);

  const result = queenMissing.length === 0 && pearlMissing.length === 0;
  return { ok: result, queenMissing, pearlMissing };
};
export const analyseResult = async (PEARL_API_URL, PEARL_AUTHENTICATION_MODE) => {
  const { id: userId } = JSON.parse(window.localStorage.getItem(PEARL_USER_KEY)) || {};
  const pearlSus = await surveyUnitIdbService.getAll();
  const pearlSurveyUnitsArray = pearlSus.map(({ id }) => id);
  const { surveyUnitsInTempZone: pearlTempZone } = getSavedSyncPearlData() || {};
  const {
    // success: queenSucess,
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

  const { ok, pearlMissing, queenMissing } = checkSyncResult(
    pearlSurveyUnitsArray,
    queenSurveyUnitsArray
  );

  if (ok) {
  } else {
    if (pearlMissing.length > 0) {
      const mailSubject = D.subjectPearlMissingUnits;
      const mailContent = D.bodyPearlMissingUnits(userId)(pearlMissing);
      // send Mail to assistance (too many units in queen database)
      await api.sendMail(PEARL_API_URL, PEARL_AUTHENTICATION_MODE)(mailSubject, mailContent);
    }
    if (queenMissing.length > 0) {
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
  }
  const result = {
    success: ok,
    message: ok
      ? "Tout s'est bien passé, vous pouvez continuer à travailler."
      : "Zut, tout ne s'est pas bien passé :/",
  };
  return result;
};

export const saveSyncPearlData = data =>
  window.localStorage.setItem('PEARL_SYNC_RESULT', JSON.stringify(data));
export const getSavedSyncPearlData = () =>
  JSON.parse(window.localStorage.getItem('PEARL_SYNC_RESULT') || '{}');
export const getSavedSyncQueenData = () =>
  JSON.parse(window.localStorage.getItem('QUEEN_SYNC_RESULT') || '{}');
