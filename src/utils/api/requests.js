import { fetcher } from './fetcher';

const getRequest = url => token => fetcher(url, token, 'GET', null);
const putRequest = url => token => body => fetcher(url, token, 'PUT', body);
const postRequest = url => token => body => fetcher(url, token, 'POST', body);

/* All surveyUnits */
const getSurveyUnits = apiUrl => token => getRequest(`${apiUrl}/api/survey-units`)(token);

/* SurveyUnit's data */
const getSurveyUnitById = apiUrl => id => token =>
  getRequest(`${apiUrl}/api/survey-unit/${id}`)(token);
const putDataSurveyUnitById = apiUrl => id => token => body =>
  putRequest(`${apiUrl}/api/survey-unit/${id}`)(token)(body);
const putToTempZone = apiUrl => id => token => body =>
  postRequest(`${apiUrl}/api/survey-unit/${id}/temp-zone`)(token)(body);

const sendMail = apiUrl => subject => content => token => {
  const mailBody = { subject, content };
  return postRequest(`${apiUrl}/api/mail`)(token)(mailBody);
};

const healthCheck = apiUrl => token => getRequest(`${apiUrl}/api/healthcheck`)(token);
const getInterviewer = apiUrl => id => token =>
  getRequest(`${apiUrl}/api/interviewer/${id}`)(token);

export const API = {
  getRequest,
  getSurveyUnits,
  getInterviewer,
  getSurveyUnitById,
  putDataSurveyUnitById,
  putToTempZone,
  sendMail,
  healthCheck,
};
