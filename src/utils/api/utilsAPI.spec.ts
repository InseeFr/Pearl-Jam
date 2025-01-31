import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { sendMail, healthCheck, getUserData } from './utilsAPI';
import { authentication, getToken } from './utils';
import { API } from './requests';

vi.mock('./utils', () => ({
  authentication: vi.fn(),
  getToken: vi.fn(),
}));

vi.mock('./requests', () => ({
  API: {
    sendMail: vi.fn(),
    healthCheck: vi.fn(),
    getInterviewer: vi.fn(),
  },
}));

describe('utilsAPI', () => {
  const urlPearApi = 'http://example.com';
  const authenticationMode = 'testMode';
  const subject = 'Test Subject';
  const content = 'Test Content';
  const id = '123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should send mail successfully', async () => {
    (getToken as Mock).mockReturnValue('mockedToken');
    (API.sendMail as Mock).mockReturnValue(() => () => () => 'Mail sent');

    await expect(sendMail(urlPearApi, authenticationMode)(subject, content)).resolves.toBe(
      'Mail sent'
    );
    expect(authentication).toHaveBeenCalledWith(authenticationMode);
    expect(getToken).toHaveBeenCalled();
    expect(API.sendMail).toHaveBeenCalledWith(urlPearApi);
  });

  it('should throw an error when sending mail fails', async () => {
    (authentication as Mock).mockImplementation(() => {
      throw new Error('Auth error');
    });

    await expect(sendMail(urlPearApi, authenticationMode)(subject, content)).rejects.toThrowError();
  });

  it('should perform health check successfully', async () => {
    (API.healthCheck as Mock).mockReturnValue(() => 'Health check passed');

    await expect(healthCheck(urlPearApi)).resolves.toBe('Health check passed');
    expect(API.healthCheck).toHaveBeenCalledWith(urlPearApi);
  });

  it('should throw an error when health check fails', async () => {
    (API.healthCheck as Mock).mockImplementation(() => {
      throw new Error('Auth error');
    });

    await expect(healthCheck(urlPearApi)).rejects.toThrowError();
  });

  it('should get user data successfully', async () => {
    (authentication as Mock).mockImplementation(() => {});
    (getToken as Mock).mockReturnValue('mockedToken');
    (API.getInterviewer as Mock).mockReturnValue(() => () => 'User data');

    await expect(getUserData(urlPearApi, authenticationMode)(id)).resolves.toBe('User data');
    expect(authentication).toHaveBeenCalledWith(authenticationMode);
    expect(getToken).toHaveBeenCalled();
    expect(API.getInterviewer).toHaveBeenCalledWith(urlPearApi);
  });

  it('should throw an error when getting user data fails', async () => {
    (authentication as Mock).mockImplementation(() => {
      throw new Error('Auth error');
    });

    await expect(getUserData(urlPearApi, authenticationMode)(id)).rejects.toThrowError();
  });
});
