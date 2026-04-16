import { createStateIdsAndCommunicationRequestIds } from 'utils/functions';

import {
  getInterviewer,
  getListSurveyUnit,
  getSurveyUnitById,
  postSurveyUnitByIdInTempZone,
  SurveyUnitDto,
  updateSurveyUnit,
} from 'api/pearl';
import { SurveyUnit, SurveyUnitComment } from 'types/pearl';
import { formatSurveyUnitForPut } from 'utils/api/utils';
import { PEARL_USER_KEY, TITLES } from 'utils/constants';
import { surveyUnitStateEnum } from 'utils/enum/SUStateEnum';
import { surveyUnitIDBService } from 'utils/indexeddb/services/surveyUnit-idb-service';
import surveyUnitMissingIdbService from 'utils/indexeddb/services/surveyUnitMissing-idb-service';
import userIdbService from 'utils/indexeddb/services/user-idb-service';
import { AxiosError } from 'axios';
import { User } from 'utils/indexeddb/model/user';
import { getSuTodoState, getLastState } from 'utils/functions/surveyUnitState';

const sendData = async (): Promise<string[]> => {
  const surveyUnitsInTempZone: string[] = [];
  const surveyUnits = await surveyUnitIDBService.getAll();
  // Filter to only get survey units that have been updated
  const updatedSurveyUnits = surveyUnits.filter(su => su.hasBeenUpdated === true);
  await Promise.all(updatedSurveyUnits.map(su => handleSurveyUnit(su, surveyUnitsInTempZone)));
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
    if (response.ok) {
      // Set hasBeenUpdated to false after successful synchronization
      const updatedSurveyUnit = await surveyUnitIDBService.getById(id);
      if (updatedSurveyUnit) {
        await surveyUnitIDBService.addOrUpdateSU({ ...updatedSurveyUnit, hasBeenUpdated: false });
      }
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
      status: Number.parseInt(axiosError?.code || '-1'),
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

  if (tempZoneError) throw new Error('Server is not responding (temp zone fallback failed)');
  surveyUnitsInTempZone.push(id);
};

const getUserData = async () => {
  const result = globalThis.localStorage.getItem(PEARL_USER_KEY);

  if (!result) {
    return;
  }
  const jsonInterviewer = JSON.parse(result);
  const { id } = jsonInterviewer;

  const interviewer = (await getInterviewer(id.toUpperCase())).data;

  await userIdbService.deleteAll();
  // prevent missing civility from crushing IDB inserts for schema-4
  // as is a bad pattern but we can't set some dtos properties as mandatory
  await userIdbService.addOrUpdate({ civility: TITLES.MISTER.type, ...interviewer } as User);
};

const clean = async () => {
  await surveyUnitIDBService.deleteAll();
  await surveyUnitMissingIdbService.deleteAll();
};

const putSurveyUnitInDataBase = async (su: SurveyUnit) => {
  await surveyUnitIDBService.addOrUpdateSU({ ...su, hasBeenUpdated: false });
};

const validateSU = (su: SurveyUnit) => {
  const { states, comments } = su;
  if (Array.isArray(states) && states.length === 0) {
    su.states.push(getLastState(states));
  }
  if (Array.isArray(comments) && comments.length === 0) {
    const interviewerComment: SurveyUnitComment = { type: 'INTERVIEWER', value: '' };
    const managementComment: SurveyUnitComment = { type: 'MANAGEMENT', value: '' };
    su.comments.push(interviewerComment, managementComment);
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
          if (!su.id) return;

          const { data: surveyUnit, status } = await getSurveyUnitById(su.id);

          if (status > 300 && ![400, 403, 404, 500].includes(status)) {
            throw new Error('Server is not responding');
          } else {
            // as is a bad pattern but we can't set some dtos properties as mandatory
            const mergedSurveyUnit = {
              ...surveyUnit,
              ...su,
            } as SurveyUnit;
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
