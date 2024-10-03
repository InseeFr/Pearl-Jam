import { authentication, formatSurveyUnitForPut, getToken } from './utils';
import { API } from './requests';
import { surveyUnitIDBService } from 'utils/indexeddb/services/surveyUnit-idb-service';
import { communicationStatusEnum } from 'utils/enum/CommunicationEnums';

export const getSurveyUnits = async (urlPearApi: string, authenticationMode: string) => {
  try {
    await authentication(authenticationMode);
    const token = getToken();
    return API.getSurveyUnits(urlPearApi)(token);
  } catch (e) {
    throw new Error(`Error during refreshToken : ${e}`);
  }
};

export const getSurveyUnitById =
  (urlPearApi: string, authenticationMode: string) => async (id: number) => {
    try {
      await authentication(authenticationMode);
      const token = getToken();
      return API.getSurveyUnitById(urlPearApi)(id)(token);
    } catch (e) {
      throw new Error(`Error during refreshToken : ${e}`);
    }
  };

export const putDataSurveyUnitById =
  (urlPearApi: string, authenticationMode: string) => async (id: number, su: SurveyUnit) => {
    try {
      await authentication(authenticationMode);
      const token = getToken();
      return API.putDataSurveyUnitById(urlPearApi)(id)(token)(await formatSurveyUnitForPut(su));
    } catch (e) {
      throw new Error(`Error during refreshToken : ${e}`);
    }
  };

export const putSurveyUnitToTempZone =
  (urlPearApi: string, authenticationMode: string) => async (id: number, su: SurveyUnit) => {
    try {
      await authentication(authenticationMode);
      const token = getToken();
      return API.putToTempZone(urlPearApi)(id)(token)(await formatSurveyUnitForPut(su));
    } catch (e) {
      throw new Error(`Error during refreshToken : ${e}`);
    }
  };
