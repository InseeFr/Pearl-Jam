import { renderHook, waitFor } from '@testing-library/react';
import { GUEST_PEARL_USER, PEARL_USER_KEY } from 'utils/constants';
import * as keycloakUtils from 'utils/keycloak';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { useAuth } from './initAuth';

vi.mock('../hooks/useConfiguration');
vi.mock('utils/keycloak');

const mockSetItem = vi.spyOn(Storage.prototype, 'setItem');
const mockGetItem = vi.spyOn(Storage.prototype, 'getItem');

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetItem.mockReset();
    mockSetItem.mockReset();
    vi.stubEnv('VITE_PEARL_AUTHENTICATION_MODE', 'keycloak');
  });

  it('should set authenticated to true in anonymous mode', () => {
    vi.stubEnv('VITE_PEARL_AUTHENTICATION_MODE', 'anonymous');

    const { result } = renderHook(() => useAuth());

    expect(mockSetItem).toHaveBeenCalledWith(PEARL_USER_KEY, JSON.stringify(GUEST_PEARL_USER));
    expect(result.current.authenticated).toBe(true);
  });

  it('should handle keycloak authentication when authorized', async () => {
    const mockRoles = ['pearl-interviewer'];
    const mockTokenInfo = { roles: mockRoles };
    (keycloakUtils.keycloakAuthentication as Mock).mockResolvedValue(true);
    (keycloakUtils.getTokenInfo as Mock).mockReturnValue(mockTokenInfo);

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(mockSetItem).toHaveBeenCalledWith(PEARL_USER_KEY, JSON.stringify(mockTokenInfo));
      expect(result.current.authenticated).toBe(true);
    });
  });

  it('should handle keycloak authentication when unauthorized', async () => {
    const mockRoles = ['some-other-role'];
    const mockTokenInfo = { roles: mockRoles };
    (keycloakUtils.keycloakAuthentication as Mock).mockResolvedValue(true);
    (keycloakUtils.getTokenInfo as Mock).mockReturnValue(mockTokenInfo);

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(mockSetItem).not.toHaveBeenCalled();
      expect(result.current.authenticated).toBe(false);
    });
  });

  it('should validate localStorage token in offline mode', async () => {
    const mockRoles = ['pearl-interviewer'];
    const mockToken = { roles: mockRoles };
    mockGetItem.mockReturnValueOnce(JSON.stringify(mockToken));
    (keycloakUtils.keycloakAuthentication as Mock).mockResolvedValue(false);

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.authenticated).toBe(true);
    });
  });

  it('should deny access if localStorage token is invalid', () => {
    mockGetItem.mockReturnValueOnce(null);
    (keycloakUtils.keycloakAuthentication as Mock).mockResolvedValue(false);

    const { result } = renderHook(() => useAuth());

    expect(result.current.authenticated).toBe(false);
  });
});
