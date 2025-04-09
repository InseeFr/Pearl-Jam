import { describe, it, expect, vi } from 'vitest';
import { API } from './requests';
import { fetcher } from './fetcher';

vi.mock('./fetcher', () => ({
  fetcher: vi.fn(async (url, token, method, body) => {
    return { url, token, method, body, status: 'success' };
  }),
}));

describe('API Module', () => {
  const apiUrl = 'https://api.example.com';
  const mockToken = 'mock-token';

  it('should make a GET request to fetch a survey unit by ID', async () => {
    const result = await API.getSurveyUnitById(apiUrl)('SU1')(mockToken);
    expect(fetcher).toHaveBeenCalledWith(`${apiUrl}/api/survey-unit/SU1`, mockToken, 'GET', null);
    expect(result.status).toBe('success');
  });

  it('should make a PUT request to update survey unit data by ID', async () => {
    const body = { data: 'mock-data' };
    const result = await API.putDataSurveyUnitById(apiUrl)('SU1')(mockToken)(body);
    expect(fetcher).toHaveBeenCalledWith(`${apiUrl}/api/survey-unit/SU1`, mockToken, 'PUT', body);
    expect(result.status).toBe('success');
  });

  it('should make a POST request to move survey unit to temp zone', async () => {
    const body = { data: 'temp-data' };
    const result = await API.putToTempZone(apiUrl)('SU1')(mockToken)(body);
    expect(fetcher).toHaveBeenCalledWith(
      `${apiUrl}/api/survey-unit/SU1/temp-zone`,
      mockToken,
      'POST',
      body
    );
    expect(result.status).toBe('success');
  });

  it('should make a POST request to send mail', async () => {
    const subject = 'Test Subject';
    const content = 'Test Content';
    const result = await API.sendMail(apiUrl)(subject)(content)(mockToken);
    expect(fetcher).toHaveBeenCalledWith(`${apiUrl}/api/mail`, mockToken, 'POST', {
      subject,
      content,
    });
    expect(result.status).toBe('success');
  });

  it('should make a GET request for health check', async () => {
    const result = await API.healthCheck(apiUrl)(mockToken);
    expect(fetcher).toHaveBeenCalledWith(`${apiUrl}/api/healthcheck`, mockToken, 'GET', null);
    expect(result.status).toBe('success');
  });

  it('should make a GET request to fetch interviewer by ID', async () => {
    const result = await API.getInterviewer(apiUrl)('INT1')(mockToken);
    expect(fetcher).toHaveBeenCalledWith(`${apiUrl}/api/interviewer/INT1`, mockToken, 'GET', null);
    expect(result.status).toBe('success');
  });
});
