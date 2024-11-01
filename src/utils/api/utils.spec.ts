import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import {
  getToken,
  getSecureHeader,
  authentication,
  formatSurveyUnitForPut,
  getHeader,
} from './utils';
import { ANONYMOUS, KEYCLOAK, PEARL_USER_KEY } from 'utils/constants';
import { communicationStatusEnum } from 'utils/enum/CommunicationEnums';
import { kc, keycloakAuthentication, refreshToken } from 'utils/keycloak';

vi.mock('utils/keycloak', () => ({
  kc: { token: 'mocked_token' },
  keycloakAuthentication: vi.fn(),
  refreshToken: vi.fn(),
}));

describe('Utils tests', () => {
  let originalNavigator: Navigator;

  beforeAll(() => {
    originalNavigator = navigator;
  });

  beforeEach(() => {
    const mockNavigator = {
      ...originalNavigator,
      onLine: true,
    };
    global.navigator = mockNavigator;
  });

  afterEach(() => {
    global.navigator = originalNavigator;
  });

  it('should return the token', () => {
    expect(getToken()).toBe('mocked_token');
  });

  it('should return secure header with token', () => {
    const header = getSecureHeader('mocked_token');
    expect(header).toEqual({ Authorization: 'Bearer mocked_token' });
  });

  it('should return empty header when token is undefined', () => {
    const header = getSecureHeader(undefined);
    expect(header).toEqual({});
  });

  it('should authenticate with KEYCLOAK', async () => {
    window.localStorage.setItem(PEARL_USER_KEY, 'user');
    await authentication(KEYCLOAK);
    expect(refreshToken).toHaveBeenCalled();
  });

  it('should resolve for ANONYMOUS mode', async () => {
    await expect(authentication(ANONYMOUS)).resolves.toBeUndefined();
  });

  it('should reject for unsupported mode', async () => {
    await expect(authentication('unsupported_mode')).rejects.toThrowError(
      'App doesn\'t support "unsupported_mode" for authentication'
    );
  });

  it('should format survey unit', async () => {
    const surveyUnit = {
      id: '1',
      persons: [],
      address: {},
      move: {},
      comments: '',
      states: [],
      contactAttempts: [],
      contactOutcome: {},
      identification: {},
      communicationRequests: [
        {
          communicationTemplateId: 'template_1',
          status: [{ status: communicationStatusEnum.INITIATED.value, date: new Date() }],
          reason: 'reason_1',
        },
        {
          communicationTemplateId: 'template_2',
          status: [{ status: 'OTHER_STATUS', date: new Date() }],
          reason: 'reason_2',
        },
      ],
    };

    const formatted = await formatSurveyUnitForPut(surveyUnit as unknown as SurveyUnit);
    expect(formatted).toEqual({
      id: '1',
      persons: [],
      address: {},
      move: {},
      comments: '',
      states: [],
      contactAttempts: [],
      contactOutcome: {},
      identification: {},
      communicationRequests: [
        {
          communicationTemplateId: 'template_1',
          creationTimestamp: expect.any(Date),
          reason: 'reason_1',
        },
      ],
    });
  });

  it('should return header for KEYCLOAK mode when online', () => {
    (navigator as any).onLine = true;
    const header = getHeader(KEYCLOAK);
    expect(header).toEqual({
      Authorization: 'Bearer mocked_token',
      Accept: 'application/json;charset=utf-8',
    });
  });

  it('should return header for KEYCLOAK mode when offline', () => {
    (navigator as any).onLine = false;
    const header = getHeader(KEYCLOAK);
    expect(header).toEqual({
      Accept: 'application/json;charset=utf-8',
    });
  });

  it('should return header for ANONYMOUS mode', () => {
    const header = getHeader(ANONYMOUS);
    expect(header).toEqual({
      Accept: 'application/json;charset=utf-8',
    });
  });
});
