import Axios from 'axios';
import { getSecureHeader } from './utils';

export const getSurveyUnits = (urlPearApi, token) =>
  new Promise((resolve, reject) => {
    Axios.get(`${urlPearApi}/api/survey-units/`, {
      headers: {
        ...getSecureHeader(token),
        Accept: 'application/json;charset=utf-8',
      },
    })
      .then(res => resolve(res))
      .catch(e => reject(new Error(`Failed to fetch survey-units : ${e.message}`)));
  });
export const getSurveyUnitById = (urlPearApi, token) => id =>
  new Promise((resolve, reject) => {
    Axios.get(`${urlPearApi}/api/survey-unit/${id}`, {
      headers: {
        ...getSecureHeader(token),
        Accept: 'application/json;charset=utf-8',
      },
    })
      .then(res => resolve(res))
      .catch(e => reject(new Error(`Failed to get survey-unit (id:${id}) : ${e.message}`)));
  });

export const putDataSurveyUnitById = (urlPearApi, token) => (id, su) =>
  new Promise((resolve, reject) => {
    Axios.put(`${urlPearApi}/api/survey-unit/${id}`, su, {
      headers: {
        ...getSecureHeader(token),
        Accept: 'application/json;charset=utf-8',
      },
    })
      .then(res => resolve(res))
      .catch(e => reject(new Error(`Failed to put survey-unit (id:${id}) : ${e.message}`)));
  });
