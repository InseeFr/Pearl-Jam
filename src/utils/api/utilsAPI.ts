import { authentication, getToken } from './utils';
import { API } from './requests';

export const sendMail =
  (urlPearApi: string, authenticationMode: string) => async (subject: string, content: string) => {
    try {
      await authentication(authenticationMode);
      const token = getToken();
      return API.sendMail(urlPearApi)(subject)(content)(token);
    } catch (e) {
      throw new Error(`Error during refreshToken : ${e}`);
    }
  };

export const healthCheck = async (urlPearApi: string) => {
  try {
    return API.healthCheck(urlPearApi)();
  } catch (e) {
    throw new Error(`Error during refreshToken : ${e}`);
  }
};
export const getUserData =
  (urlPearApi: string, authenticationMode: string) => async (id: string) => {
    try {
      await authentication(authenticationMode);
      const token = getToken();
      return API.getInterviewer(urlPearApi)(id)(token);
    } catch (e) {
      throw new Error(`Error during refreshToken : ${e}`);
    }
  };
