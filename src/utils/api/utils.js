import { ANONYMOUS, JSON_UTF8_HEADER, KEYCLOAK, PEARL_USER_KEY } from 'utils/constants';
import { kc, keycloakAuthentication, refreshToken } from 'utils/keycloak';

export const getToken = () => kc.token;

export const getSecureHeader = token =>
  token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};

export const authentication = mode => {
  switch (mode) {
    case KEYCLOAK:
      if (window.localStorage.getItem(PEARL_USER_KEY) === undefined) {
        return keycloakAuthentication({ onLoad: 'login-required' });
      }
      return refreshToken();
    case ANONYMOUS:
      return new Promise(resolve => resolve());
    default:
      return new Promise((resolve, reject) =>
        reject(new Error(`App doesn't support "${mode}" for authentication`))
      );
  }
};

export const getHeader = mode => {
  switch (mode) {
    case KEYCLOAK:
      if (!navigator.onLine) {
        return {
          Accept: JSON_UTF8_HEADER,
        };
      }
      return {
        ...getSecureHeader(getToken()),
        Accept: JSON_UTF8_HEADER,
      };
    default:
      return {
        Accept: JSON_UTF8_HEADER,
      };
  }
};
