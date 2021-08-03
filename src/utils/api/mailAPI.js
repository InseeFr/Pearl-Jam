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
