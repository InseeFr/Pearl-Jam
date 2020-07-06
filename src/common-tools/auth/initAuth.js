import { useState, useEffect } from 'react';
import { GUEST_PEARL_USER, PEARL_USER_KEY } from 'common-tools/constants';
import { keycloakAuthentication, getTokenInfo } from 'common-tools/keycloak';

export const useAuth = () => {
  const [authenticated, setAuthenticated] = useState(false);

  const interviewerRoles = [
    'pearl-interviewer',
    'Testeur_agent-insee-interne-test_Keycloak',
    'Guest',
  ];

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
    const configURL = `${window.location.origin}/configuration.json`;
    fetch(configURL)
      .then(response => response.json())
      .then(data => {
        switch (data.PEARL_AUTHENTICATION_MODE) {
          case 'anonymous':
            window.localStorage.setItem(PEARL_USER_KEY, JSON.stringify(GUEST_PEARL_USER));
            accessAuthorized();
            break;

          case 'keycloak':
            console.log('KC!!!');
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
                      // Authentifié mais n'a pas les bons droits
                      accessDenied();
                    }
                    // offline mode
                  } else if (isLocalStorageTokenValid()) {
                    accessAuthorized();
                  } else {
                    accessDenied();
                  }
                })
                .catch(() => {
                  return isLocalStorageTokenValid() ? accessAuthorized() : accessDenied();
                });
            }
            break;
          default:
        }
      });
  });

  return { authenticated };
};
