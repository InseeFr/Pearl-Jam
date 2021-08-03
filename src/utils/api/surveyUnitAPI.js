import { authentication, getToken } from './utils';
import { API } from './requests';

export const getSurveyUnits = async (urlPearApi, authenticationMode) => {
  try {
    await authentication(authenticationMode);
    const token = getToken();
    return API.getSurveyUnits(urlPearApi)(token);
  } catch (e) {
    throw new Error(`Error during refreshToken : ${e}`);
  }
};

export const getSurveyUnitById = (urlPearApi, authenticationMode) => async id => {
  try {
    await authentication(authenticationMode);
    const token = getToken();
    return API.getSurveyUnitById(urlPearApi)(id)(token);
  } catch (e) {
    throw new Error(`Error during refreshToken : ${e}`);
  }
};

export const putDataSurveyUnitById = (urlPearApi, authenticationMode) => async (id, su) => {
  try {
    await authentication(authenticationMode);
    const token = getToken();
    return API.putDataSurveyUnitById(urlPearApi)(id)(token)(su);
  } catch (e) {
    throw new Error(`Error during refreshToken : ${e}`);
  }
};

export const putSurveyUnitToTempZone = (urlPearApi, authenticationMode) => async (id, su) => {
  try {
    await authentication(authenticationMode);
    const token = getToken();
    return API.putToTempZone(urlPearApi)(id)(token)(su);
  } catch (e) {
    throw new Error(`Error during refreshToken : ${e}`);
  }
};
