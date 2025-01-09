import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { fetcher } from './fetcher';

global.fetch = vi.fn();

describe('fetcher', () => {
  const mockUrl = 'https://api.example.com/resource';
  const mockToken = 'mock-token';
  const mockBody = { key: 'value' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should make a GET request without a token', async () => {
    (fetch as Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: vi.fn(async () => ({ message: 'success' })),
    });

    const result = await fetcher(mockUrl, undefined, 'GET', null);

    expect(fetch).toHaveBeenCalledWith(mockUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'GET',
      body: null,
    });
    expect(result).toEqual({ data: { message: 'success' }, status: 200, statusText: 'OK' });
  });

  it('should make a POST request with a token and body', async () => {
    (fetch as Mock).mockResolvedValueOnce({
      ok: true,
      status: 201,
      statusText: 'Created',
      json: vi.fn(async () => ({ id: 1 })),
    });

    const result = await fetcher(mockUrl, mockToken, 'POST', mockBody);

    expect(fetch).toHaveBeenCalledWith(mockUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${mockToken}`,
      },
      method: 'POST',
      body: JSON.stringify(mockBody),
    });
    expect(result).toEqual({ data: { id: 1 }, status: 201, statusText: 'Created' });
  });

  it('should return an error for a failed response', async () => {
    (fetch as Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: vi.fn(async () => ({ error: 'Invalid request' })),
    });

    const result = await fetcher(mockUrl, mockToken, 'POST', mockBody);

    expect(fetch).toHaveBeenCalledWith(mockUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${mockToken}`,
      },
      method: 'POST',
      body: JSON.stringify(mockBody),
    });
    expect(result).toEqual({ error: true, status: 400, statusText: 'Bad Request' });
  });

  it('should handle a network error', async () => {
    (fetch as Mock).mockRejectedValueOnce(new Error('Network Error'));

    const result = await fetcher(mockUrl, mockToken, 'GET', null);

    expect(fetch).toHaveBeenCalledWith(mockUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${mockToken}`,
      },
      method: 'GET',
      body: null,
    });
    expect(result).toEqual({ error: true, statusText: 'Network Error' });
  });

  it('should return an empty object for a PUT request with no response body', async () => {
    (fetch as Mock).mockResolvedValueOnce({
      ok: true,
      status: 204,
      statusText: 'No Content',
      json: vi.fn(async () => {
        throw new Error('No JSON');
      }),
    });

    const result = await fetcher(mockUrl, mockToken, 'PUT', mockBody);

    expect(fetch).toHaveBeenCalledWith(mockUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${mockToken}`,
      },
      method: 'PUT',
      body: JSON.stringify(mockBody),
    });
    expect(result).toEqual({ data: {}, status: 204, statusText: 'No Content' });
  });
});
