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
    console.log(accessToken);
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  });

  instance.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      if (error.response) {
        throw new Error(`HTTP error! Status: ${error.response.status}`);
      }
      throw error;
    }
  );

  return instance;
};

const axiosAiguillage = createCustomAxiosInstance(import.meta.env.VITE_PEARL_API_URL);

export const customAiguillageFetch = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  return axiosAiguillage({ ...config, ...options });
};

export type ErrorType<Error> = AxiosError<Error>;
