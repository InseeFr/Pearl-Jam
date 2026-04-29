import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PEARL_USER_KEY, TITLES } from 'utils/constants';
import { surveyUnitStateEnum } from 'utils/enum/SUStateEnum';
import { synchronizePearl } from './synchronizePearl';
import { toDoEnum } from 'utils/enum/SUToDoEnum';

const pearlApiMocks = vi.hoisted(() => ({
  getInterviewer: vi.fn(),
  getListSurveyUnit: vi.fn(),
  getSurveyUnitById: vi.fn(),
  postSurveyUnitByIdInTempZone: vi.fn(),
  updateSurveyUnit: vi.fn(),
}));

vi.mock('api/pearl', () => pearlApiMocks);

const surveyUnitIdbMocks = vi.hoisted(() => ({
  getAll: vi.fn(),
  getById: vi.fn(),
  addOrUpdate: vi.fn(),
  addOrUpdateSU: vi.fn(),
  delete: vi.fn(),
  deleteAll: vi.fn(),
}));

vi.mock('utils/indexeddb/services/surveyUnit-idb-service', () => ({
  surveyUnitIDBService: surveyUnitIdbMocks,
}));

const surveyUnitMissingMocks = vi.hoisted(() => ({
  deleteAll: vi.fn(),
}));

vi.mock('utils/indexeddb/services/surveyUnitMissing-idb-service', () => ({
  default: surveyUnitMissingMocks,
}));

const userIdbMocks = vi.hoisted(() => ({
  deleteAll: vi.fn(),
  addOrUpdate: vi.fn(),
}));

vi.mock('utils/indexeddb/services/user-idb-service', () => ({
  default: userIdbMocks,
}));

const fnMocks = vi.hoisted(() => ({
  createStateIdsAndCommunicationRequestIds: vi.fn(),
}));

vi.mock('utils/functions', () => fnMocks);

const suStateMocks = vi.hoisted(() => ({
  getSuTodoState: vi.fn(),
  getLastState: vi.fn(),
}));

vi.mock('utils/functions/surveyUnitState', () => suStateMocks);

vi.mock('utils/api/utils', () => ({
  formatSurveyUnitForPut: vi.fn((body: unknown) => body),
}));

describe('synchronizePearl.tsx', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.localStorage.clear();

    suStateMocks.getSuTodoState.mockReturnValue(toDoEnum.CONTACT);
    suStateMocks.getLastState.mockReturnValue({
      date: 1773329171697,
      type: surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type,
    });

    pearlApiMocks.postSurveyUnitByIdInTempZone.mockResolvedValue({ error: null });
    pearlApiMocks.getInterviewer.mockResolvedValue({
      data: { id: 'USER1', name: 'Paul' },
    });
  });

  const su1 = {
    id: 'SU1',
    campaign: 'CAMPAIGN1',
    states: [{ type: surveyUnitStateEnum.AT_LEAST_ONE_CONTACT }],
    comments: [],
  };

  it('adds the interviewer information in IDB', async () => {
    globalThis.localStorage.setItem(PEARL_USER_KEY, JSON.stringify({ id: 'user1' }));

    surveyUnitIdbMocks.getAll
      // getAllSurveyUnitsByCampaign
      .mockResolvedValueOnce([])
      // sendData
      .mockResolvedValueOnce([])
      // getWFSSurveyUnitsSortByCampaign
      .mockResolvedValueOnce([]);

    await synchronizePearl();

    expect(pearlApiMocks.getInterviewer).toHaveBeenCalledWith('USER1');
    expect(userIdbMocks.addOrUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        civility: TITLES.MISTER.type,
        id: 'USER1',
      })
    );
  });

  it('returns synchronization details when one survey unit is uploaded', async () => {
    const su2 = {
      id: 'SU2',
      campaign: 'CAMPAIGN1',
      states: [{ type: surveyUnitStateEnum.AT_LEAST_ONE_CONTACT }],
      comments: [],
      hasBeenUpdated: true,
    };
    surveyUnitIdbMocks.getAll
      // getAllSurveyUnitsByCampaign
      .mockResolvedValueOnce([su2])
      // sendData
      .mockResolvedValueOnce([su2])
      // getWFSSurveyUnitsSortByCampaign
      .mockResolvedValueOnce([])
      // get idb surveyUnits during cleanup old suveyUnits
      .mockResolvedValueOnce([su2]);

    surveyUnitIdbMocks.getById.mockResolvedValueOnce(su2);

    surveyUnitIdbMocks.addOrUpdateSU.mockResolvedValueOnce(su2);

    pearlApiMocks.updateSurveyUnit.mockResolvedValue({
      status: 200,
      ok: true,
    });

    pearlApiMocks.getListSurveyUnit.mockResolvedValue({
      status: 200,
      data: [{ id: 'SU2', campaign: 'CAMPAIGN1' }],
    });

    pearlApiMocks.getSurveyUnitById
      // su2
      .mockResolvedValue({
        status: 200,
        data: { id: 'SU2', campaign: 'CAMPAIGN1', states: [], comments: [] },
      });

    const result = await synchronizePearl();

    expect(pearlApiMocks.updateSurveyUnit).toHaveBeenCalledTimes(1);
    expect(pearlApiMocks.updateSurveyUnit).toHaveBeenCalledWith(
      'SU2',
      expect.objectContaining({
        id: 'SU2',
        lastState: toDoEnum.CONTACT,
      })
    );

    expect(pearlApiMocks.postSurveyUnitByIdInTempZone).not.toHaveBeenCalled();

    // no survey unit to delete
    expect(surveyUnitIdbMocks.delete).not.toHaveBeenCalled();

    expect(surveyUnitMissingMocks.deleteAll).toHaveBeenCalledTimes(1);
    expect(surveyUnitIdbMocks.addOrUpdateSU).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'SU2',
        campaign: 'CAMPAIGN1',
      })
    );

    expect(result).toEqual({
      error: false,
      surveyUnitsSuccess: ['SU2'],
      surveyUnitsInTempZone: [],
      transmittedSurveyUnits: {},
      loadedSurveyUnits: { CAMPAIGN1: [] },
    });
  });

  it('returns only new survey units as loadedSurveyUnits', async () => {
    surveyUnitIdbMocks.getAll
      // getAllSurveyUnitsByCampaign
      .mockResolvedValueOnce([su1])
      // sendData
      .mockResolvedValueOnce([su1])
      // getWFSSurveyUnitsSortByCampaign
      .mockResolvedValueOnce([])
      // get idb surveyUnits during cleanup old suveyUnits
      .mockResolvedValueOnce([su1]);

    pearlApiMocks.updateSurveyUnit.mockResolvedValue({
      status: 200,
      ok: true,
    });

    pearlApiMocks.getListSurveyUnit.mockResolvedValue({
      status: 200,
      data: [
        { id: 'SU1', campaign: 'CAMPAIGN1' },
        { id: 'SU2', campaign: 'CAMPAIGN1' },
        { id: 'SU3', campaign: 'CAMPAIGN2' },
      ],
    });

    pearlApiMocks.getSurveyUnitById
      // SU1
      .mockResolvedValueOnce({
        status: 200,
        data: { id: 'SU1', campaign: 'CAMPAIGN1', states: [], comments: [] },
      })
      // SU2
      .mockResolvedValueOnce({
        status: 200,
        data: { id: 'SU2', campaign: 'CAMPAIGN1', states: [], comments: [] },
      })
      // SU3
      .mockResolvedValueOnce({
        status: 200,
        data: { id: 'SU3', campaign: 'CAMPAIGN2', states: [], comments: [] },
      });

    const result = await synchronizePearl();

    expect(pearlApiMocks.updateSurveyUnit).toHaveBeenCalledTimes(1);
    expect(pearlApiMocks.postSurveyUnitByIdInTempZone).not.toHaveBeenCalled();

    // no survey unit to delete
    expect(surveyUnitIdbMocks.delete).not.toHaveBeenCalled();

    expect(surveyUnitMissingMocks.deleteAll).toHaveBeenCalledTimes(1);
    expect(surveyUnitIdbMocks.addOrUpdateSU).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'SU2',
        campaign: 'CAMPAIGN1',
      })
    );
    expect(surveyUnitIdbMocks.addOrUpdateSU).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'SU3',
        campaign: 'CAMPAIGN2',
      })
    );

    expect(result).toEqual({
      error: false,
      surveyUnitsSuccess: ['SU1', 'SU2', 'SU3'],
      surveyUnitsInTempZone: [],
      transmittedSurveyUnits: {},
      loadedSurveyUnits: { CAMPAIGN1: ['SU2'], CAMPAIGN2: ['SU3'] },
    });
  });

  it('returns synchronization details when one survey unit goes to temp zone', async () => {
    const su2 = {
      id: 'SU2',
      campaign: 'CAMPAIGN1',
      states: [{ type: surveyUnitStateEnum.AT_LEAST_ONE_CONTACT }],
      comments: [],
      hasBeenUpdated: true,
    };

    surveyUnitIdbMocks.getAll
      // getAllSurveyUnitsByCampaign
      .mockResolvedValueOnce([su1, su2])
      // sendData
      .mockResolvedValueOnce([su2])
      // getWFSSurveyUnitsSortByCampaign
      .mockResolvedValueOnce([])
      // get idb surveyUnits during cleanup old suveyUnits
      .mockResolvedValueOnce([su1, su2]);

    pearlApiMocks.updateSurveyUnit.mockResolvedValue({
      status: 404,
      ok: false,
    });

    pearlApiMocks.getListSurveyUnit.mockResolvedValue({
      status: 200,
      data: [],
    });

    const result = await synchronizePearl();

    expect(pearlApiMocks.updateSurveyUnit).toHaveBeenCalledWith(
      'SU2',
      expect.objectContaining({
        id: 'SU2',
        lastState: toDoEnum.CONTACT,
      })
    );

    expect(pearlApiMocks.postSurveyUnitByIdInTempZone).toHaveBeenCalledWith(
      'SU2',
      expect.objectContaining({
        id: 'SU2',
        lastState: toDoEnum.CONTACT,
      })
    );

    expect(surveyUnitIdbMocks.delete).toHaveBeenCalledTimes(2);
    expect(surveyUnitMissingMocks.deleteAll).toHaveBeenCalledTimes(1);

    expect(result).toEqual({
      error: false,
      surveyUnitsSuccess: [],
      surveyUnitsInTempZone: ['SU2'],
      transmittedSurveyUnits: {},
      loadedSurveyUnits: {},
    });
  });

  it('returns error when temp zone fallback fails', async () => {
    const su2 = {
      id: 'SU2',
      campaign: 'CAMPAIGN1',
      states: [{ type: surveyUnitStateEnum.AT_LEAST_ONE_CONTACT }],
      comments: [],
      hasBeenUpdated: true,
    };

    surveyUnitIdbMocks.getAll
      // getAllSurveyUnitsByCampaign
      .mockResolvedValueOnce([su1, su2])
      // sendData
      .mockResolvedValueOnce([su2]);

    pearlApiMocks.updateSurveyUnit.mockResolvedValue({
      status: 404,
      ok: false,
    });

    pearlApiMocks.postSurveyUnitByIdInTempZone.mockResolvedValue({
      error: new Error('temp zone failed'),
    });

    const result = await synchronizePearl();

    expect(result).toEqual({
      error: true,
      surveyUnitsSuccess: undefined,
      surveyUnitsInTempZone: undefined,
    });

    expect(surveyUnitIdbMocks.deleteAll).not.toHaveBeenCalled();
    expect(surveyUnitMissingMocks.deleteAll).not.toHaveBeenCalled();
  });

  it('returns error when getListSurveyUnit fails with non fallback status', async () => {
    surveyUnitIdbMocks.getAll
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);

    pearlApiMocks.getListSurveyUnit.mockResolvedValue({
      status: 503,
      data: undefined,
    });

    const result = await synchronizePearl();

    expect(result).toEqual({
      error: true,
      surveyUnitsSuccess: undefined,
      surveyUnitsInTempZone: [],
    });
  });

  it('groups transmitted survey units by campaign only for "waiting for transmission" state', async () => {
    const suWaiting1 = {
      id: 'SU1',
      campaign: 'CAMP1',
      states: [{ type: 'A' }],
      comments: [],
      hasBeenUpdated: true,
    };
    const suWaiting2 = {
      id: 'SU2',
      campaign: 'CAMP1',
      states: [{ type: 'B' }],
      comments: [],
      hasBeenUpdated: true,
    };
    const suWaiting3 = {
      id: 'SU3',
      campaign: 'CAMP2',
      states: [{ type: 'B' }],
      comments: [],
      hasBeenUpdated: true,
    };
    const suOther = {
      id: 'SU4',
      campaign: 'CAMP2',
      states: [{ type: 'C' }],
      comments: [],
      hasBeenUpdated: true,
    };

    surveyUnitIdbMocks.getAll
      // getAllSurveyUnitsByCampaign
      .mockResolvedValueOnce([suWaiting1, suWaiting2, suWaiting3, suOther])
      // sendData
      .mockResolvedValueOnce([])
      // getWFSSurveyUnitsSortByCampaign
      .mockResolvedValueOnce([suWaiting1, suWaiting2, suWaiting3, suOther])
      // get idb surveyUnits during cleanup old suveyUnits
      .mockResolvedValueOnce([suWaiting1, suWaiting2, suWaiting3, suOther]);

    suStateMocks.getLastState
      // SU1
      .mockReturnValueOnce(surveyUnitStateEnum.WAITING_FOR_SYNCHRONIZATION)
      // SU2
      .mockReturnValueOnce(surveyUnitStateEnum.WAITING_FOR_SYNCHRONIZATION)
      // SU3
      .mockReturnValueOnce(surveyUnitStateEnum.WAITING_FOR_SYNCHRONIZATION)
      // SU4
      .mockReturnValueOnce({
        date: 1773329171697,
        type: surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type,
      });

    pearlApiMocks.getListSurveyUnit.mockResolvedValue({
      status: 200,
      data: [],
    });

    const result = await synchronizePearl();

    expect(result).toEqual({
      error: false,
      surveyUnitsSuccess: [],
      surveyUnitsInTempZone: [],
      transmittedSurveyUnits: { CAMP1: ['SU1', 'SU2'], CAMP2: ['SU3'] },
      loadedSurveyUnits: {},
    });
  });

  it('deletes correctly old survey units', async () => {
    const su2 = {
      id: 'SU2',
      campaign: 'CAMPAIGN1',
      states: [{ type: surveyUnitStateEnum.AT_LEAST_ONE_CONTACT }],
      comments: [],
      hasBeenUpdated: true,
    };

    const su3 = {
      id: 'SU3',
      campaign: 'CAMPAIGN2',
      states: [{ type: surveyUnitStateEnum.AT_LEAST_ONE_CONTACT }],
      comments: [],
      hasBeenUpdated: false,
    };

    surveyUnitIdbMocks.getAll
      // getAllSurveyUnitsByCampaign
      .mockResolvedValueOnce([su1, su2, su3])
      // sendData
      .mockResolvedValueOnce([su2])
      // getWFSSurveyUnitsSortByCampaign
      .mockResolvedValueOnce([])
      // get idb surveyUnits during cleanup old suveyUnits
      .mockResolvedValueOnce([su1, su2, su3]);

    pearlApiMocks.updateSurveyUnit.mockResolvedValue({
      status: 404,
      ok: false,
    });

    pearlApiMocks.getListSurveyUnit.mockResolvedValue({
      status: 200,
      data: [{ id: 'SU1', campaign: 'CAMPAIGN1' }],
    });

    pearlApiMocks.getSurveyUnitById
      // su2
      .mockResolvedValue({
        status: 200,
        data: { id: 'SU1', campaign: 'CAMPAIGN1', states: [], comments: [] },
      });

    await synchronizePearl();

    // su1 is still expected, while su2 & su3 needs to be deleted
    expect(surveyUnitIdbMocks.delete).toHaveBeenCalledTimes(2);
    expect(surveyUnitIdbMocks.delete).toHaveBeenCalledWith('SU2');
    expect(surveyUnitIdbMocks.delete).toHaveBeenCalledWith('SU3');

    expect(surveyUnitMissingMocks.deleteAll).toHaveBeenCalledTimes(1);
  });
});
