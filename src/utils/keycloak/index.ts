import Keycloak from 'keycloak-js';
import { PEARL_URL } from 'utils/constants';

export const kc = new Keycloak(`${PEARL_URL}/keycloak.json`);
export const keycloakAuthentication = (params: unknown) =>
  new Promise<void | boolean>((resolve, reject) => {
    if (navigator.onLine) {
      kc.init(params)
        .then((authenticated: boolean) => {
          resolve(authenticated);
        })
        .catch((e: Error) => {
          reject(e);
        });
    } else {
      resolve();
    }
  });

export const refreshToken = (minValidity = 5) =>
  new Promise<void>((resolve, reject) => {
    if (navigator.onLine) {
      kc.updateToken(minValidity)
        .then(() => resolve())
        .catch((error: Error) => reject(error));
    } else {
      resolve();
    }
  });

export const getTokenInfo = () => {
  const tokenParsed = kc?.tokenParsed as {
    family_name: string;
    given_name: string;
    preferred_username: string;
  };

  const lastName = tokenParsed?.family_name || '';
  const firstName = tokenParsed?.given_name || '';
  const id = tokenParsed?.preferred_username || '';
  const roles =
    (kc && kc.tokenParsed && kc.tokenParsed.realm_access && kc.tokenParsed.realm_access.roles) ||
    [];
  return { id, lastName, firstName, roles };
};
