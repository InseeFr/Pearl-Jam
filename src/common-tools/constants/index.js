export const KEYCLOAK = 'keycloak';
export const ANONYMOUS = 'anonymous';
export const AUTHENTICATION_MODE_ENUM = [ANONYMOUS, KEYCLOAK];

export const PEARL_URL = window.localStorage.getItem('PEARL_URL') || '';
export const PEARL_USER_KEY = 'pearl-user';
export const GUEST_PEARL_USER = {
  lastName: 'Guest',
  firstName: 'Guest',
  id: 'Guest',
  roles: ['Guest'],
};
export const JSON_UTF8_HEADER = 'application/json;charset=utf-8';
