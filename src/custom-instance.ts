import axios, {
  AxiosError,
  AxiosResponse,
  type AxiosInstance,
  type AxiosRequestConfig,
} from 'axios';
import { authentication, getToken } from 'utils/api/utils';

// Function to create a custom Axios instance
const createCustomAxiosInstance = (baseUrl: string): AxiosInstance => {
  const instance = axios.create({ baseURL: baseUrl });

  instance.interceptors.request.use(async config => {
    await authentication(import.meta.env.VITE_PEARL_AUTHENTICATION_MODE);
    const accessToken = getToken();
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  });

  instance.interceptors.response.use(
    response => {
      return {
        ...response,
        error: response.status > 300,
        ok: response.status >= 200 && response.status <= 299,
      };
    },
    error => {
      if (error.response) {
        if (error.response.status==404) {
          console.log("Resource not found -> handle error internally")
          return {
            ...error.response,
            error: true,
            ok: false
          }
        }

        throw new Error(`HTTP error! Status: ${error.response.status}`);
      }
      throw error;
    }
  );

  return instance;
};

const axiosPearl = createCustomAxiosInstance(import.meta.env.VITE_PEARL_API_URL);

export const customFetch = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<AxiosResponse<T> & { error: boolean; ok: boolean }> => {
  return axiosPearl({ ...config, ...options });
};

export type ErrorType<Error> = AxiosError<Error>;
