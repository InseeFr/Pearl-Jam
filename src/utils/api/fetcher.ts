
export type Method =
  | 'GET'
  | 'OPTIONS'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'


// manage empty response during PUT or POST request
const readJsonResponse = async (response: Response) => {
  try {
    return await response.json();
  } catch (e) {
    return {};
  }
};

export const fetcher = async (url: string, token: string | undefined, method: Method, body: object | null) => {
  const headers = { Accept: 'application/json', 'Content-Type': 'application/json' };
  try {
    const response = await fetch(url, {
      headers: token ? { ...headers, Authorization: `Bearer ${token}` } : headers,
      method,
      body: body ? JSON.stringify(body) : null,
    });
    const { ok, status, statusText } = response;
    if (ok) {
      try {
        const data = await readJsonResponse(response);
        return { data, status, statusText };
      } catch (error: any) {
        return { error: true, status, statusText: error?.message };
      }
    } else {
      return { error: true, status, statusText };
    }
  } catch (error: any) {
    // network error
    return { error: true, statusText: error.message };
  }
};
