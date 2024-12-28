import { SurveyUnit } from 'types/pearl';
import { ANONYMOUS, JSON_UTF8_HEADER, KEYCLOAK, PEARL_USER_KEY } from 'utils/constants';
import { communicationStatusEnum } from 'utils/enum/CommunicationEnums';
import { kc, keycloakAuthentication, refreshToken } from 'utils/keycloak';

export const getToken = () => kc.token;

export const getSecureHeader = (token: string | undefined) =>
  token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};

export const authentication = (mode: string) => {
  switch (mode) {
    case KEYCLOAK:
      if (window.localStorage.getItem(PEARL_USER_KEY) === undefined) {
        return keycloakAuthentication({ onLoad: 'login-required' });
      }
      return refreshToken();
    case ANONYMOUS:
      return new Promise<void>(resolve => resolve());
    default:
      return Promise.reject(new Error(`App doesn't support "${mode}" for authentication`));
  }
};
export const formatSurveyUnitForPut = async (su: SurveyUnit) => {
  const newFormattedCommunicationRequests =
    su.communicationRequests
      ?.filter(
        comReq =>
          comReq.status.length === 1 &&
          comReq.status.find(s => s.status === communicationStatusEnum.INITIATED.value)
      )
      .map(comReq => ({
        communicationTemplateId: comReq.communicationTemplateId,
        creationTimestamp: comReq.status[0].date,
        reason: comReq.reason,
      })) ?? [];

  const formattedSurveyUnit = {
    id: su.id,
    persons: su.persons,
    address: su.address,
    move: su.move,
    comments: su.comments,
    states: su.states,
    contactAttempts: su.contactAttempts,
    contactOutcome: su.contactOutcome,
    identification: su.identification,
    communicationRequests: newFormattedCommunicationRequests,
  };

  return formattedSurveyUnit;
};

export const getHeader = (mode: string) => {
  if (mode === KEYCLOAK) {
    if (!navigator.onLine) {
      return {
        Accept: JSON_UTF8_HEADER,
      };
    }

    return {
      ...getSecureHeader(getToken()),
      Accept: JSON_UTF8_HEADER,
    };
  }
  return {
    Accept: JSON_UTF8_HEADER,
  };
};
