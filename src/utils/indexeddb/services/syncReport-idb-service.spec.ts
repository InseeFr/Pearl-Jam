import { beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import SyncReportIdbService from './syncReport-idb-service';
import { SyncReport } from '../model/syncReport';

vi.mock('./abstract-idb-service');

describe('SurveyUnitIdbService - addOrUpdateNotif', () => {
  let mockGet: MockInstance<(typeof SyncReportIdbService)['getById']>;
  let mockUpdate: MockInstance<(typeof SyncReportIdbService)['update']>;
  let mockInsert: MockInstance<(typeof SyncReportIdbService)['insert']>;

  beforeEach(() => {
    mockGet = vi.spyOn(SyncReportIdbService, 'getById');
    mockUpdate = vi.spyOn(SyncReportIdbService, 'update');
    mockInsert = vi.spyOn(SyncReportIdbService, 'insert');
    vi.clearAllMocks();
  });

  it('should update the report if it already exists', async () => {
    const existingReport = { id: '123' };
    const updatedReport = {
      id: '123',
    };

    mockGet.mockResolvedValue(existingReport);
    mockUpdate.mockResolvedValue(updatedReport);

    const result = await SyncReportIdbService.addOrUpdateReport(updatedReport);

    expect(mockGet).toHaveBeenCalledWith('123');
    expect(mockUpdate).toHaveBeenCalledWith(updatedReport);
    expect(result).toEqual(updatedReport);
  });

  it('should insert the report if it does not exist', async () => {
    const report: SyncReport = {
      id: '456',
      transmittedSurveyUnits: {},
      loadedSurveyUnits: {},
    };

    mockGet.mockResolvedValue(null);
    mockInsert.mockResolvedValue(report);

    const result = await SyncReportIdbService.addOrUpdateReport(report);

    expect(mockGet).toHaveBeenCalledWith('456');
    expect(mockInsert).toHaveBeenCalledWith(report);
    expect(result).toEqual(report);
  });
});
