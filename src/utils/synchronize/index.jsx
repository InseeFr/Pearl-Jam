import * as api from 'utils/api';

import { createCommunicationRequestIds, createStateIds, getSuTodoState } from 'utils/functions';
import { useCallback, useState } from 'react';

import { surveyUnitIDBService } from 'utils/indexeddb/services/surveyUnit-idb-service';
import surveyUnitMissingIdbService from 'utils/indexeddb/services/surveyUnitMissing-idb-service';
import { surveyUnitStateEnum } from 'utils/enum/SUStateEnum';
import { useNavigate } from 'react-router-dom';
import { TITLES, PEARL_USER_KEY } from 'utils/constants';
import userIdbService from 'utils/indexeddb/services/user-idb-service';

export const useQueenSynchronisation = () => {
  const waitTime = 5000;

  const [queenError, setQueenError] = useState(false);
  const [queenReady, setQueenReady] = useState(true);
  const navigate = useNavigate();

  const checkQueen = () => {
    setQueenReady(null);
    const tooLateErrorThrower = setTimeout(() => {
      setQueenError(true);
      setQueenReady(true);
    }, waitTime);

    const handleQueenEvent = async event => {
      const { type, command, state } = event.detail;
      if (type === 'QUEEN' && command === 'HEALTH_CHECK') {
        clearTimeout(tooLateErrorThrower);
        if (state === 'READY') {
          setQueenError(false);
          setQueenReady(true);
          console.log('Queen is ready');
        } else {
          setQueenError(true);
          setQueenReady(true);
          console.log('Queen is not ready');
        }
      }
    };
    const removeQueenEventListener = () => {
      window.removeEventListener('QUEEN', handleQueenEvent);
    };

    window.addEventListener('QUEEN', handleQueenEvent);

    const data = { type: 'PEARL', command: 'HEALTH_CHECK' };
    const event = new CustomEvent('PEARL', { detail: data });
    window.dispatchEvent(event);
    setTimeout(() => removeQueenEventListener(), waitTime);
  };

  const synchronizeQueen = useCallback(() => {
    navigate(`/queen/synchronize`);
  }, [navigate]);

  return { checkQueen, synchronizeQueen, queenReady, queenError };
};

const sendData = async (urlPearlApi, authenticationMode) => {
  const surveyUnitsInTempZone = [];
  const surveyUnits = await surveyUnitIDBService.getAll();
  await Promise.all(
    surveyUnits.map(async surveyUnit => {
      const lastState = getSuTodoState(surveyUnit);
      const { id } = surveyUnit;
      const body = {
        ...surveyUnit,
        lastState,
      };
      const {
        data: latestSurveyUnit,
        error,
        status,
      } = await api.putDataSurveyUnitById(urlPearlApi, authenticationMode)(id, body);
      if (!error) {
        await createStateIds(latestSurveyUnit);
        await createCommunicationRequestIds(latestSurveyUnit);
      }
      if (error && [400, 403, 404, 500].includes(status)) {
        const { error: tempZoneError } = await api.putSurveyUnitToTempZone(
          urlPearlApi,
          authenticationMode
        )(id, body);
        if (!tempZoneError) surveyUnitsInTempZone.push(id);
        else throw new Error('Server is not responding');
      } else if (error && ![400, 403, 404, 500].includes(status))
        throw new Error('Server is not responding');
    })
  );
  return surveyUnitsInTempZone;
};

const getUserData = async (urlPearlApi, authenticationMode) => {
  const result = window.localStorage.getItem(PEARL_USER_KEY);
  const jsonInterviewer = JSON.parse(result);
  const { id } = jsonInterviewer;
  const { data: interviewer } = await api.getUserData(
    urlPearlApi,
    authenticationMode
  )(id.toUpperCase());
  await userIdbService.deleteAll();
  // prevent missing civility from crushing IDB inserts for schema-4
  await userIdbService.addOrUpdate({ civility: TITLES.MISTER.type, ...interviewer });
};

const putSurveyUnitInDataBase = async su => {
  await surveyUnitIDBService.addOrUpdate(su);
};

const clean = async () => {
  await surveyUnitIDBService.deleteAll();
  await surveyUnitMissingIdbService.deleteAll();
};

const validateSU = su => {
  const { states, comments } = su;
  if (Array.isArray(states) && states.length === 0) {
    su.states.push(su.lastState);
  }
  if (Array.isArray(comments) && comments.length === 0) {
    const interviewerComment = { type: 'INTERVIEWER', value: '' };
    const managementComment = { type: 'MANAGEMENT', value: '' };
    su.comments.push(interviewerComment);
    su.comments.push(managementComment);
  }

  return su;
};

const getData = async (pearlApiUrl, pearlAuthenticationMode) => {
  const surveyUnitsSuccess = [];
  const surveyUnitsFailed = [];
  const {
    data: surveyUnits,
    error,
    status,
  } = await api.getSurveyUnits(pearlApiUrl, pearlAuthenticationMode);

  if (!error) {
    await Promise.all(
      surveyUnits.map(async su => {
        const { data: surveyUnit, error: getSuError } = await api.getSurveyUnitById(
          pearlApiUrl,
          pearlAuthenticationMode
        )(su.id);
        if (!getSuError) {
          const mergedSurveyUnit = { ...surveyUnit, ...su };
          const validSurveyUnit = validateSU(mergedSurveyUnit);
          await putSurveyUnitInDataBase(validSurveyUnit);
          surveyUnitsSuccess.push({ id: mergedSurveyUnit.id, campaign: mergedSurveyUnit.campaign });
        } else if ([400, 403, 404, 500].includes(status)) surveyUnitsFailed.push(su.id);
        else throw new Error('Server is not responding');
      })
    );
  } else if (![400, 403, 404, 500].includes(status)) throw new Error('Server is not responding');

  return { surveyUnitsSuccess, surveyUnitsFailed };
};

const getWFSSurveyUnitsSortByCampaign = async () => {
  const allSurveyUnits = await surveyUnitIDBService.getAll();
  return allSurveyUnits.reduce((wfs, su) => {
    const { campaign, id } = su;
    const lastState = getSuTodoState(su);
    if (lastState?.type === surveyUnitStateEnum.WAITING_FOR_SYNCHRONIZATION.type)
      return { ...wfs, [campaign]: [...(wfs[campaign] || []), id] };
    return wfs;
  }, {});
};

const getAllSurveyUnitsByCampaign = async () => {
  const allSurveyUnits = await surveyUnitIDBService.getAll();
  return allSurveyUnits.reduce((wfs, su) => {
    const { campaign, id } = su;
    return { ...wfs, [campaign]: [...(wfs[campaign] || []), id] };
  }, {});
};

const getNewSurveyUnitsByCampaign = async (newSurveyUnits = [], oldSurveyUnits = {}) => {
  const newSurveyUnitsByCampaign = newSurveyUnits.reduce((_, su) => {
    const { campaign, id } = su;
    return { ..._, [campaign]: [...(_[campaign] || []), id] };
  }, {});

  return Object.entries(newSurveyUnitsByCampaign).reduce((_, [campaign, surveyUnitIds]) => {
    const newIds = surveyUnitIds.reduce((_, id) => {
      const oldSus = oldSurveyUnits[campaign] || [];
      if (!oldSus.includes(id)) return [..._, id];
      return _;
    }, []);
    return { ..._, [campaign]: newIds };
  }, {});
};

export const synchronizePearl = async (PEARL_API_URL, PEARL_AUTHENTICATION_MODE) => {
  let transmittedSurveyUnits = {};
  let loadedSurveyUnits = {};

  let surveyUnitsInTempZone;
  let surveyUnitsSuccess;
  const allOldSurveyUnitsByCampaign = await getAllSurveyUnitsByCampaign();
  try {
    await getUserData(PEARL_API_URL, PEARL_AUTHENTICATION_MODE);
    surveyUnitsInTempZone = await sendData(PEARL_API_URL, PEARL_AUTHENTICATION_MODE);
    transmittedSurveyUnits = await getWFSSurveyUnitsSortByCampaign();

    await clean();

    const { surveyUnitsSuccess: susSuccess } = await getData(
      PEARL_API_URL,
      PEARL_AUTHENTICATION_MODE
    );
    surveyUnitsSuccess = susSuccess.map(({ id }) => id);
    loadedSurveyUnits = await getNewSurveyUnitsByCampaign(susSuccess, allOldSurveyUnitsByCampaign);
    return {
      error: false,
      surveyUnitsSuccess,
      surveyUnitsInTempZone,
      transmittedSurveyUnits,
      loadedSurveyUnits,
    };
  } catch (e) {
    console.debug(e);
    return { error: true, surveyUnitsSuccess, surveyUnitsInTempZone };
  }
};
