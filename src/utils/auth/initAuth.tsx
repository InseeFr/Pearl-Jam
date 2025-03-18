import { GUEST_PEARL_USER, PEARL_USER_KEY } from 'utils/constants';
import { getTokenInfo, keycloakAuthentication } from 'utils/keycloak';
import { useEffect, useRef, useState } from 'react';

export const useAuth = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const init = useRef(false);

  const interviewerRoles = import.meta.env.VITE_KEYCLOAK_ROLES_ALLOW_LIST.split(',');

  const accessAuthorized = () => {
    setAuthenticated(true);
  };

  const accessDenied = () => {
    setAuthenticated(false);
  };

  const isAuthorized = (roles: string[]) =>
    roles.filter(r => interviewerRoles.includes(r)).length > 0;

  const isLocalStorageTokenValid = () => {
    const pearlUserKey = window.localStorage.getItem(PEARL_USER_KEY);
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
    /*if (init.current) {
      console.log('alreadyInit');
      return;
    }*/

    const PEARL_AUTHENTICATION_MODE = import.meta.env.VITE_PEARL_AUTHENTICATION_MODE;
    switch (PEARL_AUTHENTICATION_MODE) {
      case 'anonymous':
        window.localStorage.setItem(PEARL_USER_KEY, JSON.stringify(GUEST_PEARL_USER));
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
                window.localStorage.setItem(PEARL_USER_KEY, JSON.stringify(interviewerInfos));
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
    init.current = true;
  }, []);

  return { authenticated };
};
