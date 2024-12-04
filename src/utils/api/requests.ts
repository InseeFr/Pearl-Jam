import { fetcher } from './fetcher';

const getRequest = (url: string) => (token?: string) => fetcher(url, token, 'GET', null);
const putRequest = (url: string) => (token?: string) => (body: object) => fetcher(url, token, 'PUT', body);
const postRequest = (url: string) => (token?: string) => (body: object) => fetcher(url, token, 'POST', body);

/* All surveyUnits */
const getSurveyUnits = (apiUrl: string) => (token?: string) => getRequest(`${apiUrl}/api/survey-units`)(token);

/* SurveyUnit's data */
const getSurveyUnitById = (apiUrl: string) => (id: string) => (token?: string) =>
  getRequest(`${apiUrl}/api/survey-unit/${id}`)(token);
const putDataSurveyUnitById = (apiUrl: string) => (id: string) => (token?: string) => (body: object) =>
  putRequest(`${apiUrl}/api/survey-unit/${id}`)(token)(body);
const putToTempZone = (apiUrl: string) => (id: string) => (token?: string) => (body: object) =>
  postRequest(`${apiUrl}/api/survey-unit/${id}/temp-zone`)(token)(body);

const sendMail = (apiUrl: string) => (subject: string) => (content: string) => (token?: string) => {
  const mailBody = { subject, content };
  return postRequest(`${apiUrl}/api/mail`)(token)(mailBody);
};

const healthCheck = (apiUrl: string) => (token?: string) => getRequest(`${apiUrl}/api/healthcheck`)(token);
const getInterviewer = (apiUrl: string) => (id: string) => (token?: string) =>
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
