import surveyUnitDBService from 'indexedbb/services/surveyUnit-idb-service';
import contactAttemptDBService from 'indexedbb/services/contactAttempt-idb-service';
import { getLastState } from 'common-tools/functions';
import * as api from 'common-tools/api';

const handleQueenEvent = async event => {
  const { type, command, state } = event.detail;
  if (type === 'QUEEN' && command === 'HEALTH_CHECK') {
    if (state === 'READY') {
      console.log('healthcheck successful : now sending sync event');
      const data = { type: 'PEARL', command: 'SYNCHRONIZE' };
      const syncEvent = new CustomEvent('PEARL', { detail: data });

      window.dispatchEvent(syncEvent);
    } else {
      console.log('error with queen SW');
      throw new Error('Queen service worker not responding');
    }
  }
};

const synchronizeQueen = async () => {
  console.log('synchro queen : event listener added');
  window.addEventListener('QUEEN', handleQueenEvent);

  const data = { type: 'PEARL', command: 'HEALTH_CHECK' };
  const event = new CustomEvent('PEARL', { detail: data });

  console.log('synchro queen : healthcheckEvent sent');
  window.dispatchEvent(event);

  console.log('synchro queen : event listener removed');
  setTimeout(() => window.removeEventListener('QUEEN', handleQueenEvent), 2000);
};

const getConfiguration = async () => {
  const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
  const response = await fetch(`${publicUrl.origin}/configuration.json`);
  const configuration = await response.json();
  return configuration;
};

const sendData = async (urlPearlApi, authenticationMode) => {
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
      await api.putDataSurveyUnitById(urlPearlApi, authenticationMode)(id, {
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

const getData = async (pearlApiUrl, pearlAuthenticationMode) => {
  const surveyUnitsResponse = await api.getSurveyUnits(pearlApiUrl, pearlAuthenticationMode);
  const surveyUnits = await surveyUnitsResponse.data;

  await Promise.all(
    surveyUnits.map(async su => {
      const surveyUnitResponse = await api.getSurveyUnitById(
        pearlApiUrl,
        pearlAuthenticationMode
      )(su.id);
      const surveyUnit = await surveyUnitResponse.data;
      const mergedSurveyUnit = { ...surveyUnit, ...su };
      const validSurveynit = await validateSU(mergedSurveyUnit);
      await putSurveyUnitsInDataBase(validSurveynit);
    })
  );
};

const synchronizePearl = async () => {
  const { PEARL_API_URL, PEARL_AUTHENTICATION_MODE } = await getConfiguration();

  await sendData(PEARL_API_URL, PEARL_AUTHENTICATION_MODE);

  await clean();

  await getData(PEARL_API_URL, PEARL_AUTHENTICATION_MODE);
};

export const synchronize = async () => {
  await synchronizeQueen();
  synchronizePearl();
};
