import { authentication, getToken } from './utils';
import { API } from './requests';

export const sendMail = (urlPearApi, authenticationMode) => async (subject, content) => {
  try {
    await authentication(authenticationMode);
    const token = getToken();
    return API.sendMail(urlPearApi)(subject)(content)(token);
  } catch (e) {
    throw new Error(`Error during refreshToken : ${e}`);
  }
};

export const healthCheck = async (urlPearApi, authenticationMode) => {
  try {
    await authentication(authenticationMode);
    const token = getToken();
    return API.healthCheck(urlPearApi)(token);
  } catch (e) {
    throw new Error(`Error during refreshToken : ${e}`);
  }
};
export const getUserData = (urlPearApi, authenticationMode) => async id => {
  try {
    await authentication(authenticationMode);
    const token = getToken();
    return API.getInterviewer(urlPearApi)(id)(token);
  } catch (e) {
    throw new Error(`Error during refreshToken : ${e}`);
  }
};
