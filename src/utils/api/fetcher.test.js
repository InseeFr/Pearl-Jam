import { fetcher } from './fetcher';
import jest from 'jest-mock';


describe('fetcher', () => {
  const mockResponse = (status, data) => {
    return Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      statusText: 'OK',
      json: () => Promise.resolve(data),
    });
  };

  it('should return data and status when the response is successful', async () => {
    const url = 'https://example.com/api';
    const token = 'my-token';
    const method = 'POST';
    const body = { name: 'John Doe' };
    const responseData = { id: 1, name: 'John Doe' };

    global.fetch = jest.fn().mockImplementation(() => mockResponse(200, responseData));

    const result = await fetcher(url, token, method, body);

    expect(fetch).toHaveBeenCalledWith(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer my-token',
      },
      method: 'POST',
      body: JSON.stringify({ name: 'John Doe' }),
    });

    expect(result).toEqual({
      data: { id: 1, name: 'John Doe' },
      status: 200,
      statusText: 'OK',
    });
  });

  it('should return error and status when the response is not successful', async () => {
    const url = 'https://example.com/api';
    const token = null;
    const method = 'GET';
    const body = null;

    global.fetch = jest.fn().mockImplementation(() => mockResponse(404, null));

    const result = await fetcher(url, token, method, body);

    expect(fetch).toHaveBeenCalledWith(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'GET',
      body: null,
    });

    expect(result).toEqual({
      error: true,
      status: 404,
      statusText: 'OK',
    });
  });

  it('should return error and statusText when there is a network error', async () => {
    const url = 'https://example.com/api';
    const token = 'my-token';
    const method = 'POST';
    const body = { name: 'John Doe' };

    global.fetch = jest.fn().mockImplementation(() => {
      throw new Error('Network error');
    });

    const result = await fetcher(url, token, method, body);

    expect(fetch).toHaveBeenCalledWith(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer my-token',
      },
      method: 'POST',
      body: JSON.stringify({ name: 'John Doe' }),
    });

    expect(result).toEqual({
      error: true,
      statusText: 'Network error',
    });
  });
});