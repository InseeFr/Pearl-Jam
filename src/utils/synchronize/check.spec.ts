import notificationIdbService from 'utils/indexeddb/services/notification-idb-service';
import { surveyUnitIDBService } from 'utils/indexeddb/services/surveyUnit-idb-service';
import syncReportIdbService from 'utils/indexeddb/services/syncReport-idb-service';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import {
  analyseResult,
  checkSyncResult,
  getNotifFromResult,
  getReportFromResult,
  getSavedSyncPearlData,
  getSavedSyncQueenData,
  saveSyncPearlData,
} from './check';
import { NotificationState } from 'types/pearl';
import * as api from 'api/pearl';

describe('check.ts', () => {
  describe('checkSyncResult', () => {
    it('should return missing units correctly', () => {
      const pearlSuccess = ['unit1', 'unit2'];
      const queenSuccess = ['unit2'];
      const result = checkSyncResult(pearlSuccess, queenSuccess);
      expect(result).toEqual({ queenMissing: ['unit1'], pearlMissing: [] });
    });

    it('should return empty object if no successes', () => {
      const result = checkSyncResult([], []);
      expect(result).toEqual({ pearlMissing: [], queenMissing: [] });
    });
  });

  describe('getNotifFromResult', () => {
    it('should create a notification object', () => {
      const result = { state: 'success' as NotificationState, messages: [] };
      const nowDate = Date.now();
      const notification = getNotifFromResult(result, nowDate);
      expect(notification).toHaveProperty('date', nowDate);
      expect(notification).toHaveProperty('type', 'synchronization');
      expect(notification).toHaveProperty('title');
      expect(notification).toHaveProperty('messages', []);
      expect(notification).toHaveProperty('state', 'success');
      expect(notification).toHaveProperty('read', false);
      expect(notification).toHaveProperty('detail', `report-${nowDate}`);
    });
  });

  describe('getReportFromResult', () => {
    it('should return report with details if state is not error', () => {
      const result = {
        details: { transmittedSurveyUnits: {}, loadedSurveyUnits: {} },
        state: 'success',
      };
      const report = getReportFromResult(result);
      expect(report).toHaveProperty('id');
      expect(report).toHaveProperty('transmittedSurveyUnits');
      expect(report).toHaveProperty('loadedSurveyUnits');
    });

    it('should return only id if state is error', () => {
      const result = { state: 'error' };
      const report = getReportFromResult(result);
      expect(report).toHaveProperty('id');
      expect(report).not.toHaveProperty('transmittedSurveyUnits');
      expect(report).not.toHaveProperty('loadedSurveyUnits');
    });
  });

  it('saveSyncPearlData - save data into the localStorage', () => {
    const data = { test: 'data' };
    saveSyncPearlData(data);
    expect(window.localStorage.getItem('PEARL_SYNC_RESULT')).toBe(JSON.stringify(data));
  });

  it('getSavedSyncPearlData - get pearl data from the localStorage', () => {
    const data = { test: 'data' };
    saveSyncPearlData(data);
    const retrievedData = getSavedSyncPearlData();
    expect(retrievedData).toEqual(data);
  });

  it('getSavedSyncQueenData - get queen from localStorage', () => {
    const data = { test: 'data' };
    window.localStorage.setItem('QUEEN_SYNC_RESULT', JSON.stringify(data));
    const retrievedData = getSavedSyncQueenData();
    expect(retrievedData).toEqual(data);
  });

  vi.mock('utils/api');
  vi.mock('utils/indexeddb/services/notification-idb-service');
  vi.mock('utils/indexeddb/services/syncReport-idb-service');
  vi.mock('utils/indexeddb/services/surveyUnit-idb-service');
  vi.mock('utils/indexeddb/services/surveyUnitMissing-idb-service');

  describe('analyseResult', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should handle errors and not send notifications', async () => {
      const pearlData = {
        error: 'pearlError',
        surveyUnitsInTempZone: [],
        transmittedSurveyUnits: {},
        loadedSurveyUnits: {},
      };
      const queenData = {
        error: 'queenError',
        surveyUnitsSuccess: ['1'],
        surveyUnitsInTempZone: [],
      };

      window.localStorage.setItem('QUEEN_SYNC_RESULT', JSON.stringify(queenData));
      saveSyncPearlData(pearlData);
      vi.spyOn(surveyUnitIDBService, 'getAll').mockResolvedValue([{ id: '1' }]);
      vi.spyOn(api, 'postMailMessage').mockImplementation(vi.fn());
      vi.spyOn(notificationIdbService, 'addOrUpdateNotif').mockResolvedValue(undefined);
      vi.spyOn(syncReportIdbService, 'addOrUpdateReport').mockResolvedValue(undefined);

      const result = await analyseResult();

      expect(result).toEqual({
        state: 'error',
        messages: expect.any(Array),
      });
      expect(api.postMailMessage).not.toHaveBeenCalled();
    });

    it('should send mail for missing units', async () => {
      const pearlData = {
        error: null,
        surveyUnitsInTempZone: [],
        transmittedSurveyUnits: {},
        loadedSurveyUnits: {},
      };
      const queenData = {
        error: null,
        surveyUnitsSuccess: [],
        surveyUnitsInTempZone: [],
      };

      window.localStorage.setItem('QUEEN_SYNC_RESULT', JSON.stringify(queenData));
      saveSyncPearlData(pearlData);
      vi.spyOn(surveyUnitIDBService, 'getAll').mockResolvedValue([{ id: '1' }]);

      vi.spyOn(api, 'postMailMessage').mockImplementation(vi.fn());
      vi.spyOn(notificationIdbService, 'addOrUpdateNotif').mockResolvedValue(undefined);
      vi.spyOn(syncReportIdbService, 'addOrUpdateReport').mockResolvedValue(undefined);

      const result = await analyseResult();

      expect(result).toEqual({
        state: 'warning',
        messages: expect.any(Array),
        details: expect.any(Object),
      });
      expect(api.postMailMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: 'Problem during synchronization : Survey-units are missing',
        })
      );
    });

    it('should return success when no errors or missing units', async () => {
      const pearlData = {
        error: null,
        surveyUnitsInTempZone: [],
        transmittedSurveyUnits: {},
        loadedSurveyUnits: {},
      };
      const queenData = {
        error: null,
        surveyUnitsSuccess: ['1'],
        surveyUnitsInTempZone: [],
      };

      window.localStorage.setItem('QUEEN_SYNC_RESULT', JSON.stringify(queenData));
      saveSyncPearlData(pearlData);
      vi.spyOn(surveyUnitIDBService, 'getAll').mockResolvedValue([{ id: '1' }]);
      vi.spyOn(api, 'postMailMessage').mockImplementation(vi.fn());
      vi.spyOn(notificationIdbService, 'addOrUpdateNotif').mockResolvedValue(undefined);
      vi.spyOn(syncReportIdbService, 'addOrUpdateReport').mockResolvedValue(undefined);

      const result = await analyseResult();

      expect(result).toEqual({
        state: 'success',
        messages: expect.any(Array),
        details: expect.any(Object),
      });
    });
  });
});
