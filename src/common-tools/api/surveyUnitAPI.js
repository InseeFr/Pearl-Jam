import Axios from 'axios';
import { getHeader, authentication } from './utils';

export const getSurveyUnits = (urlPearApi, authenticationMode) => {
  return new Promise((resolve, reject) => {
    authentication(authenticationMode)
      .then(() => {
        Axios.get(`${urlPearApi}/api/survey-units`, {
          headers: getHeader(authenticationMode),
        })
          .then(res => resolve(res))
          .catch(e => {
            reject(new Error(`Failed to fetch survey-units : ${e.response.data.error.message}`));
          });
      })
      .catch(e => {
        reject(new Error(`Error during refreshToken : ${e.response.data.error.message}`));
      });
  });
};

export const getSurveyUnitById = (urlPearApi, authenticationMode) => id => {
  return new Promise((resolve, reject) => {
    authentication(authenticationMode)
      .then(() => {
        Axios.get(`${urlPearApi}/api/survey-unit/${id}`, {
          headers: getHeader(authenticationMode),
        })
          .then(res => resolve(res))
          .catch(e => reject(new Error(`Failed to fetch survey-unit (id:${id}) : ${e.message}`)));
      })
      .catch(e => reject(new Error(`Error during refreshToken : ${e.message}`)));
  });
};

export const putDataSurveyUnitById = (urlPearApi, authenticationMode) => (id, su) => {
  return new Promise((resolve, reject) => {
    authentication(authenticationMode)
      .then(() => {
        Axios.put(`${urlPearApi}/api/survey-unit/${id}`, su, {
          headers: getHeader(authenticationMode),
        })
          .then(res => resolve(res))
          .catch(e => reject(new Error(`Failed to put survey-unit (id:${id}) : ${e.message}`)));
      })
      .catch(e => reject(new Error(`Error during refreshToken : ${e.message}`)));
  });
};
