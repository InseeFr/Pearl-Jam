import { useEffect, useState } from 'react';
import { GUEST_PEARL_USER, PEARL_USER_KEY } from 'utils/constants';
import { getTokenInfo, keycloakAuthentication } from 'utils/keycloak';

function getAuthMode() {
  return import.meta.env.VITE_PEARL_AUTHENTICATION_MODE;
}

export const useAuth = () => {
  const [authenticated, setAuthenticated] = useState(false);

  const interviewerRoles = import.meta.env.VITE_KEYCLOAK_ROLES_ALLOW_LIST.split(',');

  const accessAuthorized = () => {
    setAuthenticated(true);
  };

  const accessDenied = () => {
    setAuthenticated(false);
  };

  const isAuthorized = (roles: string[]) => roles.some(r => interviewerRoles.includes(r));

  const isLocalStorageTokenValid = () => {
    const pearlUserKey = globalThis.localStorage.getItem(PEARL_USER_KEY);
    if (!pearlUserKey) {
      return false;
    }
    const interviewer = JSON.parse(pearlUserKey);
    if (interviewer?.roles) {
      const { roles } = interviewer;
      if (isAuthorized(roles)) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    const PEARL_AUTHENTICATION_MODE = getAuthMode();
    switch (PEARL_AUTHENTICATION_MODE) {
      case 'anonymous':
        globalThis.localStorage.setItem(PEARL_USER_KEY, JSON.stringify(GUEST_PEARL_USER));
        accessAuthorized();
        break;

      case 'keycloak':
        keycloakAuthentication({
          onLoad: 'login-required',
          checkLoginIframe: false,
        })
          .then(auth => {
            if (auth) {
              const interviewerInfos = getTokenInfo();
              const { roles } = interviewerInfos;
              if (isAuthorized(roles)) {
                globalThis.localStorage.setItem(PEARL_USER_KEY, JSON.stringify(interviewerInfos));
                accessAuthorized();
              } else {
                accessDenied();
              }
              // offline mode
            } else if (isLocalStorageTokenValid()) {
              accessAuthorized();
            } else {
              accessDenied();
            }
          })
          .catch(() => (isLocalStorageTokenValid() ? accessAuthorized() : accessDenied()));
        break;
      default:
    }
  }, []);

  return { authenticated };
};
