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

const sendData = async () => {
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

      try {
        const {
          status,
          data: latestSurveyUnit,
          error,
          ok,
        } = await updateSurveyUnit(id, formatSurveyUnitForPut(body));

        if (ok) {
          await createStateIdsAndCommunicationRequestIds(latestSurveyUnit);
        }

        if ([400, 403, 404, 500].includes(status)) {
          const { error: tempZoneError } = await postSurveyUnitByIdInTempZone(
            id,
            formatSurveyUnitForPut(body)
          );
          if (!tempZoneError) surveyUnitsInTempZone.push(id);
          else throw new Error('Server is not responding');
        }

        if (error && ![400, 403, 404, 500].includes(status)) {
          throw new Error('Server is not responding');
        }
      } catch {
        throw new Error('Server is not responding');
      }
    })
  );
  return surveyUnitsInTempZone;
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
    const previousData = await surveyUnitIDBService.getAll();

    surveyUnitsInTempZone = await sendData();
    transmittedSurveyUnits = await getWFSSurveyUnitsSortByCampaign();
    console.log({ previousData });
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
      previousData,
    };
  } catch (e) {
    console.debug(e);
    return { error: true, surveyUnitsSuccess, surveyUnitsInTempZone };
  }
};
