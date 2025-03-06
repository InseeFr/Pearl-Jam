import * as api from 'utils/api';

import { useCallback, useState } from 'react';
import {
  createStateIdsAndCommunicationRequestIds,
  getLastState,
  getSuTodoState,
} from 'utils/functions';

import { useNavigate } from 'react-router-dom';
import { QueenEvent } from 'types/events';
import { SurveyUnit } from 'types/pearl';
import { PEARL_USER_KEY, TITLES } from 'utils/constants';
import { surveyUnitStateEnum } from 'utils/enum/SUStateEnum';
import { surveyUnitIDBService } from 'utils/indexeddb/services/surveyUnit-idb-service';
import surveyUnitMissingIdbService from 'utils/indexeddb/services/surveyUnitMissing-idb-service';
import userIdbService from 'utils/indexeddb/services/user-idb-service';

export const useQueenSynchronisation = () => {
  const waitTime = 5000;

  const [queenError, setQueenError] = useState(false);
  const [queenReady, setQueenReady] = useState<boolean | null>(true);
  const navigate = useNavigate();

  const checkQueen = () => {
    setQueenReady(null);
    const tooLateErrorThrower = setTimeout(() => {
      setQueenError(true);
      setQueenReady(true);
    }, waitTime);

    const handleQueenEvent = async (event: QueenEvent) => {
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

const sendData = async (urlPearlApi: string, authenticationMode: string) => {
  const surveyUnitsInTempZone: string[] = [];
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
        await createStateIdsAndCommunicationRequestIds(latestSurveyUnit);
      }
      if (error && status && [400, 403, 404, 500].includes(status)) {
        const { error: tempZoneError } = await api.putSurveyUnitToTempZone(
          urlPearlApi,
          authenticationMode
        )(id, body);
        if (!tempZoneError) surveyUnitsInTempZone.push(id);
        else throw new Error('Server is not responding');
      } else if (error && status && ![400, 403, 404, 500].includes(status))
        throw new Error('Server is not responding');
    })
  );
  return surveyUnitsInTempZone;
};

const getUserData = async (urlPearlApi: string, authenticationMode: string) => {
  const result = window.localStorage.getItem(PEARL_USER_KEY);

  if (!result) {
    return;
  }
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

const putSurveyUnitInDataBase = async (su: SurveyUnit) => {
  await surveyUnitIDBService.addOrUpdate(su);
};

const clean = async () => {
  await surveyUnitIDBService.deleteAll();
  await surveyUnitMissingIdbService.deleteAll();
};

const validateSU = (su: SurveyUnit) => {
  const { states, comments } = su;
  if (Array.isArray(states) && states.length === 0) {
    su.states.push(getLastState(states));
  }
  if (Array.isArray(comments) && comments.length === 0) {
    const interviewerComment = { type: 'INTERVIEWER', value: '' };
    const managementComment = { type: 'MANAGEMENT', value: '' };
    su.comments.push(interviewerComment);
    su.comments.push(managementComment);
  }

  return su;
};

const getData = async (pearlApiUrl: string, pearlAuthenticationMode: string) => {
  const surveyUnitsSuccess: { id: string; campaign: string }[] = [];
  const surveyUnitsFailed: string[] = [];
  const {
    data: surveyUnits,
    error,
    status,
  } = await api.getSurveyUnits(pearlApiUrl, pearlAuthenticationMode);

  if (!error) {
    await Promise.all(
      surveyUnits.map(async (su: SurveyUnit) => {
        const { data: surveyUnit, error: getSuError } = await api.getSurveyUnitById(
          pearlApiUrl,
          pearlAuthenticationMode
        )(su.id);
        if (!getSuError) {
          const mergedSurveyUnit: SurveyUnit = { ...surveyUnit, ...su };
          const validSurveyUnit = validateSU(mergedSurveyUnit);
          await putSurveyUnitInDataBase(validSurveyUnit);
          surveyUnitsSuccess.push({ id: mergedSurveyUnit.id, campaign: mergedSurveyUnit.campaign });
        } else if (status && [400, 403, 404, 500].includes(status)) surveyUnitsFailed.push(su.id);
        else throw new Error('Server is not responding');
      })
    );
  } else if (status && ![400, 403, 404, 500].includes(status))
    throw new Error('Server is not responding');

  return { surveyUnitsSuccess, surveyUnitsFailed };
};

const getWFSSurveyUnitsSortByCampaign = async () => {
  const allSurveyUnits = await surveyUnitIDBService.getAll();
  return allSurveyUnits.reduce((wfs, su) => {
    const { campaign, id } = su;
    const lastState = getLastState(su.states);
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

const getNewSurveyUnitsByCampaign = async (
  newSurveyUnits: {
    id: string;
    campaign: string;
  }[] = [],
  oldSurveyUnits: Record<string, string[]> = {}
) => {
  const newSurveyUnitsByCampaign = newSurveyUnits.reduce(
    (_, su) => {
      const { campaign, id } = su;
      return { ..._, [campaign]: [...(_[campaign] || []), id] };
    },
    {} as Record<string, string[]>
  );

  return Object.entries(newSurveyUnitsByCampaign).reduce((_, [campaign, surveyUnitIds]) => {
    const newIds = surveyUnitIds.reduce((_, id) => {
      const oldSus = oldSurveyUnits[campaign] || [];
      if (!oldSus.includes(id)) return [..._, id];
      return _;
    }, [] as string[]);
    return { ..._, [campaign]: newIds };
  }, {});
};

export const synchronizePearl = async (
  PEARL_API_URL: string,
  PEARL_AUTHENTICATION_MODE: string
) => {
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
