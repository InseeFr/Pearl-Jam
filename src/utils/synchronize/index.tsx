import { useCallback, useState } from 'react';
import {
  createStateIdsAndCommunicationRequestIds,
  getLastState,
  getSuTodoState,
} from 'utils/functions';

import {
  getInterviewer,
  getListSurveyUnit,
  getSurveyUnitById,
  postSurveyUnitByIdInTempZone,
  SurveyUnitDto,
  updateSurveyUnit,
} from 'api/pearl';
import { useNavigate } from 'react-router-dom';
import { QueenEvent } from 'types/events';
import { SurveyUnit } from 'types/pearl';
import { formatSurveyUnitForPut } from 'utils/api/utils';
import { PEARL_USER_KEY, TITLES } from 'utils/constants';
import { surveyUnitStateEnum } from 'utils/enum/SUStateEnum';
import { surveyUnitIDBService } from 'utils/indexeddb/services/surveyUnit-idb-service';
import surveyUnitMissingIdbService from 'utils/indexeddb/services/surveyUnitMissing-idb-service';
import userIdbService from 'utils/indexeddb/services/user-idb-service';
import { AxiosError } from 'axios';

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

const sendData = async (): Promise<string[]> => {
  const surveyUnitsInTempZone: string[] = [];
  const surveyUnits = await surveyUnitIDBService.getAll();
  await Promise.all(surveyUnits.map(su => handleSurveyUnit(su, surveyUnitsInTempZone)));
  return surveyUnitsInTempZone;
};

const handleSurveyUnit = async (
  surveyUnit: any,
  surveyUnitsInTempZone: string[]
): Promise<void> => {
  const lastState = getSuTodoState(surveyUnit);
  const { id } = surveyUnit;
  const body = { ...surveyUnit, lastState };
  const formattedBody = formatSurveyUnitForPut(body);

  try {
    const response = await tryUpdateSurveyUnit(id, formattedBody);

    if (response.ok && response.data) {
      await createStateIdsAndCommunicationRequestIds(response.data);
    }

    if (shouldPutInTempZone(response.status)) {
      await handleTempZoneFallback(id, formattedBody, surveyUnitsInTempZone);
    }

    if (response.error && !shouldPutInTempZone(response.status)) {
      throw new Error('Unhandled server error');
    }
  } catch (e) {
    throw new Error(`Error during refreshToken: ${e}`);
  }
};

const tryUpdateSurveyUnit = async (
  id: string,
  formattedBody: any
): Promise<{
  status?: number;
  ok?: boolean;
  data?: any;
  error?: any;
}> => {
  try {
    return await updateSurveyUnit(id, formattedBody);
  } catch (err) {
    const axiosError = err as AxiosError;

    return {
      status: parseInt(axiosError?.code || '-1'),
      error: axiosError,
      ok: false,
    };
  }
};

const shouldPutInTempZone = (status?: number): boolean =>
  [400, 403, 404, 500].includes(status ?? -1);

const handleTempZoneFallback = async (
  id: string,
  formattedBody: any,
  surveyUnitsInTempZone: string[]
) => {
  const { error: tempZoneError } = await postSurveyUnitByIdInTempZone(id, formattedBody);

  console.log(tempZoneError);

  if (!tempZoneError) {
    surveyUnitsInTempZone.push(id);
  } else {
    throw new Error('Server is not responding (temp zone fallback failed)');
  }
};

const getUserData = async () => {
  const result = window.localStorage.getItem(PEARL_USER_KEY);

  if (!result) {
    return;
  }
  const jsonInterviewer = JSON.parse(result);
  const { id } = jsonInterviewer;

  const { data: interviewer } = await getInterviewer(id.toUpperCase());

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

const getData = async () => {
  const surveyUnitsSuccess: { id: string; campaign: string }[] = [];

  try {
    const { status, data: surveyUnits } = await getListSurveyUnit();
    if (status && !surveyUnits && ![400, 403, 404, 500].includes(status))
      throw new Error('Server is not responding');

    await Promise.all(
      surveyUnits.map(async (su: SurveyUnitDto) => {
        try {
          const { data: surveyUnit, status } = await getSurveyUnitById(su.id);

          if (status > 300 && ![400, 403, 404, 500].includes(status)) {
            throw new Error('Server is not responding');
          } else {
            const mergedSurveyUnit: SurveyUnit = { ...surveyUnit, ...su };
            const validSurveyUnit = validateSU(mergedSurveyUnit);
            await putSurveyUnitInDataBase(validSurveyUnit);
            surveyUnitsSuccess.push({
              id: mergedSurveyUnit.id,
              campaign: mergedSurveyUnit.campaign,
            });
          }
        } catch {
          throw new Error('Server is not responding');
        }
      })
    );
  } catch {
    throw new Error('Server is not responding');
  }

  return { surveyUnitsSuccess };
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

export const synchronizePearl = async () => {
  let transmittedSurveyUnits = {};
  let loadedSurveyUnits = {};

  let surveyUnitsInTempZone;
  let surveyUnitsSuccess;
  const allOldSurveyUnitsByCampaign = await getAllSurveyUnitsByCampaign();
  try {
    await getUserData();
    surveyUnitsInTempZone = await sendData();
    transmittedSurveyUnits = await getWFSSurveyUnitsSortByCampaign();

    await clean();

    const { surveyUnitsSuccess: susSuccess } = await getData();

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
