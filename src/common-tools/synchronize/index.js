import surveyUnitDBService from 'indexedbb/services/surveyUnit-idb-service';
import contactAttemptDBService from 'indexedbb/services/contactAttempt-idb-service';
import { getLastState } from 'common-tools/functions';
import * as api from 'common-tools/api';

const synchronizeQueen = () => {
  const data = { type: 'PEARL', command: 'SYNCHRONIZE' };
  const event = new CustomEvent('PEARL', { detail: data });
  window.dispatchEvent(event);
};

const getConfiguration = async () => {
  const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
  const response = await fetch(`${publicUrl.origin}/configuration.json`);
  const configuration = await response.json();
  return configuration;
};

const sendData = async (urlPearlApi, token) => {
  const surveyUnits = await surveyUnitDBService.getAll();
  await Promise.all(
    surveyUnits.map(async surveyUnit => {
      const lastState = getLastState(surveyUnit);
      let contactAttempts = await contactAttemptDBService.findByIds(surveyUnit.contactAttempts);
      contactAttempts = contactAttempts.map(ca => {
        delete ca.id;
        return ca;
      });
      const { id } = surveyUnit;
      await api.putDataSurveyUnitById(urlPearlApi, token)(id, {
        ...surveyUnit,
        lastState,
        contactAttempts,
      });
    })
  );
};

const putSurveyUnitsInDataBase = async su => {
  await surveyUnitDBService.addOrUpdate(su);
};

const clean = async () => {
  await surveyUnitDBService.deleteAll();
};

const validateSU = async su => {
  const { states, comments } = su;
  if (Array.isArray(states) && states.length === 0) {
    su.states.push(su.lastState);
  }
  if (Array.isArray(comments) && comments.length === 0) {
    const interviewerComment = { type: 'INTERVIEWER', value: '' };
    const managementComment = { type: 'MANAGEMENT', value: '' };
    su.comments.push(interviewerComment);
    su.comments.push(managementComment);
  }

  let { contactAttempts } = su;

  contactAttempts = await Promise.all(
    contactAttempts.map(async ca => {
      const id = await contactAttemptDBService.insert(ca);
      return id;
    })
  );
  const newSurveyUnit = su;
  newSurveyUnit.contactAttempts = contactAttempts;

  return su;
};

const synchronizePearl = async () => {
  // (0) : get configuration
  const { PEARL_API_URL, PEARL_AUTHENTICATION_MODE } = await getConfiguration();
  let token = null;

  // (1) : authentication
  if (PEARL_AUTHENTICATION_MODE === 'keycloak') {
    token = undefined; // TODO get new keycloak token;
  }

  // (2) : send the local data to server
  await sendData(PEARL_API_URL, token);

  // (3) : clean
  await clean();
  console.log('clean done');
  // (4) : Get the data
  const surveyUnitsResponse = await api.getSurveyUnits(PEARL_API_URL, token);
  const surveyUnits = await surveyUnitsResponse.data;

  await Promise.all(
    surveyUnits.map(async su => {
      const surveyUnitResponse = await api.getSurveyUnitById(PEARL_API_URL, token)(su.id);
      const surveyUnit = await surveyUnitResponse.data;
      const mergedSurveyUnit = { ...surveyUnit, ...su };
      const validSurveynit = await validateSU(mergedSurveyUnit);
      await putSurveyUnitsInDataBase(validSurveynit);
    })
  );
};

export const synchronize = async () => {
  await synchronizeQueen();
  await synchronizePearl();

  // TODO : pearl synch
};
