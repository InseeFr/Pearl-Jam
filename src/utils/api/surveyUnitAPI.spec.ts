import { describe, it, expect, vi } from 'vitest';
import {
  getSurveyUnits,
  getSurveyUnitById,
  putDataSurveyUnitById,
  putSurveyUnitToTempZone,
} from './surveyUnitAPI';
import { API } from './requests';
import { authentication, formatSurveyUnitForPut, getToken } from './utils';
import { SurveyUnit } from 'types/pearl';

vi.mock('./utils', () => ({
  authentication: vi.fn(),
  formatSurveyUnitForPut: vi.fn(async su => su),
  getToken: vi.fn(() => 'mock-token'),
}));

vi.mock('./requests', () => ({
  API: {
    getSurveyUnits: vi.fn(() => vi.fn(() => Promise.resolve([{ id: 'SU1' }, { id: 'SU2' }]))),
    getSurveyUnitById: vi.fn(() => vi.fn(() => vi.fn(() => Promise.resolve({ id: 'SU1' })))),
    putDataSurveyUnitById: vi.fn(() =>
      vi.fn(() => vi.fn(() => vi.fn(() => Promise.resolve('success'))))
    ),
    putToTempZone: vi.fn(() => vi.fn(() => vi.fn(() => vi.fn(() => Promise.resolve('success'))))),
  },
}));

describe('API Module', () => {
  const urlPearApi = 'https://api.example.com';
  const authenticationMode = 'mock-auth-mode';

  it('should fetch all survey units', async () => {
    const result = await getSurveyUnits(urlPearApi, authenticationMode);
    expect(authentication).toHaveBeenCalledWith(authenticationMode);
    expect(getToken).toHaveBeenCalled();
    expect(API.getSurveyUnits).toHaveBeenCalledWith(urlPearApi);
    expect(result).toEqual([{ id: 'SU1' }, { id: 'SU2' }]);
  });

  it('should fetch a survey unit by ID', async () => {
    const getSurveyUnit = getSurveyUnitById(urlPearApi, authenticationMode);
    const result = await getSurveyUnit('SU1');
    expect(authentication).toHaveBeenCalledWith(authenticationMode);
    expect(getToken).toHaveBeenCalled();
    expect(API.getSurveyUnitById).toHaveBeenCalledWith(urlPearApi);
    expect(result).toEqual({ id: 'SU1' });
  });

  it('should update survey unit data by ID', async () => {
    const putSurveyUnit = putDataSurveyUnitById(urlPearApi, authenticationMode);
    const mockSurveyUnit = { id: 'SU1', data: 'mock-data' } as unknown as SurveyUnit;
    const result = await putSurveyUnit('SU1', mockSurveyUnit);
    expect(authentication).toHaveBeenCalledWith(authenticationMode);
    expect(getToken).toHaveBeenCalled();
    expect(formatSurveyUnitForPut).toHaveBeenCalledWith(mockSurveyUnit);
    expect(API.putDataSurveyUnitById).toHaveBeenCalledWith(urlPearApi);
    expect(result).toBe('success');
  });

  it('should move survey unit to temp zone by ID', async () => {
    const putToTempZone = putSurveyUnitToTempZone(urlPearApi, authenticationMode);
    const mockSurveyUnit = { id: 'SU1', data: 'mock-data' } as unknown as SurveyUnit;
    const result = await putToTempZone('SU1', mockSurveyUnit);
    expect(authentication).toHaveBeenCalledWith(authenticationMode);
    expect(getToken).toHaveBeenCalled();
    expect(formatSurveyUnitForPut).toHaveBeenCalledWith(mockSurveyUnit);
    expect(API.putToTempZone).toHaveBeenCalledWith(urlPearApi);
    expect(result).toBe('success');
  });
});
