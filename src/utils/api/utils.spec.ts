import { ANONYMOUS, KEYCLOAK, PEARL_USER_KEY } from 'utils/constants';
import { refreshToken } from 'utils/keycloak';
import { createSurveyUnit } from 'utils/testing/createFakeData';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  authentication,
  formatSurveyUnitForPut,
  getHeader,
  getSecureHeader,
  getToken,
} from './utils';

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
    const surveyUnit = createSurveyUnit();

    const formatted = await formatSurveyUnitForPut(surveyUnit);
    expect(formatted).toEqual({
      id: 'SU12345',
      identification: {
        access: null,
        category: null,
        identification: null,
        occupant: null,
        situation: null,
      },
      move: false,
      persons: [
        {
          id: 1,
          title: 'Mr',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          birthdate: 631152000000, // Correspond à une date en timestamp (1er Janvier 1990)
          favoriteEmail: true,
          privileged: false,
          phoneNumbers: [
            {
              source: 'Home',
              favorite: true,
              number: '1234567890',
              id: 'PN1',
            },
            {
              source: 'Work',
              favorite: false,
              number: '0987654321',
              id: 'PN2',
            },
          ],
        },
      ],
      address: {
        l1: '123 Main Street',
        l2: 'Apartment 4B',
        l3: '',
        l4: '',
        l5: '',
        l6: '',
        l7: '',
        elevator: true,
        building: 'A',
        floor: '4',
        door: 'B',
        staircase: '1',
        cityPriorityDistrict: false,
      },
      comments: [
        {
          type: 'Note',
          value: 'Respondent prefers contact in the evening.',
        },
      ],
      communicationRequests: [],
      contactAttempts: [
        {
          date: 1700000000000,
          medium: 'Phone',
          status: 'SUCCESS',
        },
      ],
      contactOutcome: {
        date: 1700000000000,
        totalNumberOfContactAttempts: 3,
        type: 'COMPLETED',
      },
      states: [
        {
          date: 1700000000000,
          id: 1,
          type: 'INITIALIZED',
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
