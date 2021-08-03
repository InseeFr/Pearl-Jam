import { GUEST_PEARL_USER, PEARL_USER_KEY } from 'utils/constants';
import { getTokenInfo, keycloakAuthentication } from 'utils/keycloak';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from 'Root';

export const useAuth = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const configuration = useContext(AppContext);

  const interviewerRoles = ['pearl-interviewer', 'uma_authorization', 'Guest'];

  const accessAuthorized = () => {
    setAuthenticated(true);
  };

  const accessDenied = () => {
    setAuthenticated(false);
  };

  const isAuthorized = roles => roles.filter(r => interviewerRoles.includes(r)).length > 0;

  const isLocalStorageTokenValid = () => {
    const interviewer = JSON.parse(window.localStorage.getItem(PEARL_USER_KEY));
    if (interviewer && interviewer.roles) {
      const { roles } = interviewer;
      if (isAuthorized(roles)) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    const { PEARL_AUTHENTICATION_MODE } = configuration;
    switch (PEARL_AUTHENTICATION_MODE) {
      case 'anonymous':
        window.localStorage.setItem(PEARL_USER_KEY, JSON.stringify(GUEST_PEARL_USER));
        accessAuthorized();
        break;

      case 'keycloak':
        if (!authenticated) {
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
        }
        break;
      default:
    }
  });

  return { authenticated };
};
