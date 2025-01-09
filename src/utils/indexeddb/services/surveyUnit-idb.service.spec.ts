import { vi, describe, beforeEach, expect, Mock, it, MockInstance } from 'vitest';
import { surveyUnitIDBService } from './surveyUnit-idb-service';
import { SurveyUnit } from '../idb-config';

vi.mock('./abstract-idb-service');

describe('SurveyUnitIdbService - addOrUpdateNotif', () => {
  let mockGet: MockInstance<(typeof surveyUnitIDBService)['getById']>;
  let mockUpdate: MockInstance<(typeof surveyUnitIDBService)['update']>;
  let mockInsert: MockInstance<(typeof surveyUnitIDBService)['insert']>;

  beforeEach(() => {
    mockGet = vi.spyOn(surveyUnitIDBService, 'getById');
    mockUpdate = vi.spyOn(surveyUnitIDBService, 'update');
    mockInsert = vi.spyOn(surveyUnitIDBService, 'insert');
    vi.clearAllMocks();
  });

  it('should update the surveyUnit if it already exists', async () => {
    const existingSurveyUnit = { id: '123' };
    const updatedSurveyUnit = {
      id: '123',
      displayName: 'Updated SurveyUnit',
    } as unknown as SurveyUnit;

    mockGet.mockResolvedValue(existingSurveyUnit);
    mockUpdate.mockResolvedValue(updatedSurveyUnit);

    const result = await surveyUnitIDBService.addOrUpdateSU(updatedSurveyUnit);

    expect(mockGet).toHaveBeenCalledWith('123');
    expect(mockUpdate).toHaveBeenCalledWith(updatedSurveyUnit);
    expect(result).toEqual(updatedSurveyUnit);
  });

  it('should insert the surveyUnit if it does not exist', async () => {
    const newSurveyUnit = { id: '456' } as unknown as SurveyUnit;

    mockGet.mockResolvedValue(null);
    mockInsert.mockResolvedValue(newSurveyUnit);

    const result = await surveyUnitIDBService.addOrUpdateSU(newSurveyUnit);

    expect(mockGet).toHaveBeenCalledWith('456');
    expect(mockInsert).toHaveBeenCalledWith(newSurveyUnit);
    expect(result).toEqual(newSurveyUnit);
  });
});
