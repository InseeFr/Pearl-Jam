import { GUEST_PEARL_USER, PEARL_USER_KEY } from 'utils/constants';
import { getTokenInfo, keycloakAuthentication } from 'utils/keycloak';
import { useEffect, useRef, useState } from 'react';

import { useConfiguration } from '../hooks/useConfiguration';

export const useAuth = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const configuration = useConfiguration();
  const init = useRef(false);

  const interviewerRoles = ['pearl-interviewer', 'uma_authorization', 'Guest'];

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
    if (init.current) {
      console.log('alreadyInit');
      return;
    }

    const { PEARL_AUTHENTICATION_MODE } = configuration;
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
