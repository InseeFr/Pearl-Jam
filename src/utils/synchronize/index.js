import * as api from 'utils/api';
import { getLastState } from 'utils/functions';
import surveyUnitDBService from 'indexedbb/services/surveyUnit-idb-service';
import surveyUnitMissingIdbService from 'indexedbb/services/surveyUnitMissing-idb-service';
import { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';

export const useQueenSynchronisation = () => {
  const waitTime = 5000;

  const [queenError, setQueenError] = useState(false);
  const [queenReady, setQueenReady] = useState(null);
  const history = useHistory();

  const checkQueen = () => {
    setQueenReady(null);
    const tooLateErrorThrower = setTimeout(() => {
      setQueenError(true);
      setQueenReady(false);
    }, waitTime);

    const handleQueenEvent = async event => {
      const { type, command, state } = event.detail;
      if (type === 'QUEEN' && command === 'HEALTH_CHECK') {
        clearTimeout(tooLateErrorThrower);
        if (state === 'READY') {
          setQueenReady(true);
          setQueenError(false);
          console.log('Queen is ready');
        } else {
          setQueenError(true);
          setQueenReady(false);
          console.log('Queen is not ready');
        }
      }
    };
    const removeQueenEventListener = () => {
      window.removeEventListener('QUEEN', handleQueenEvent);
    };

    window.addEventListener('QUEEN', handleQueenEvent);

    const data = { type: 'PEARL', command: 'HEALTH_CHECK' };
    const event = new CustomEvent('PEARL', { detail: data });
    window.dispatchEvent(event);
    setTimeout(() => removeQueenEventListener(), waitTime);
  };

  const synchronizeQueen = useCallback(() => {
    history.push(`/queen/synchronize`);
  }, [history]);

  return { checkQueen, synchronizeQueen, queenReady, queenError };
};

const sendData = async (urlPearlApi, authenticationMode) => {
  const surveyUnitsInTempZone = [];
  const surveyUnits = await surveyUnitDBService.getAll();
  await Promise.all(
    surveyUnits.map(async surveyUnit => {
      const lastState = getLastState(surveyUnit);
      const { id } = surveyUnit;
      const body = {
        ...surveyUnit,
        lastState,
      };
      const { error, status } = await api.putDataSurveyUnitById(urlPearlApi, authenticationMode)(
        id,
        body
      );
      if (error && status === 403) {
        await api.putSurveyUnitToTempZone(urlPearlApi, authenticationMode)(id, body);
        surveyUnitsInTempZone.push(id);
      } else if (error) {
        // stop synchro to not lose data (5xx : server is probably KO)
        throw new Error('Server is not responding');
      }
    })
  );
  return surveyUnitsInTempZone;
};

const putSurveyUnitInDataBase = async su => {
  await surveyUnitDBService.addOrUpdate(su);
};

const clean = async () => {
  await surveyUnitDBService.deleteAll();
  await surveyUnitMissingIdbService.deleteAll();
};

const validateSU = su => {
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

  return su;
};

const getData = async (pearlApiUrl, pearlAuthenticationMode) => {
  const surveyUnitsSuccess = [];
  const surveyUnitsFailed = [];
  const { data: surveyUnits, error } = await api.getSurveyUnits(
    pearlApiUrl,
    pearlAuthenticationMode
  );

  if (!error) {
    await Promise.all(
      surveyUnits.map(async su => {
        const { data: surveyUnit, error: getSuError } = await api.getSurveyUnitById(
          pearlApiUrl,
          pearlAuthenticationMode
        )(su.id);
        if (!getSuError) {
          const mergedSurveyUnit = { ...surveyUnit, ...su };
          const validSurveyUnit = validateSU(mergedSurveyUnit);
          await putSurveyUnitInDataBase(validSurveyUnit);
          surveyUnitsSuccess.push(su.id);
        } else {
          surveyUnitsFailed.push(su.id);
        }
      })
    );
  }
  return { surveyUnitsSuccess, surveyUnitsFailed };
};

export const synchronizePearl = async (PEARL_API_URL, PEARL_AUTHENTICATION_MODE) => {
  const surveyUnitsInTempZone = await sendData(PEARL_API_URL, PEARL_AUTHENTICATION_MODE);

  await clean();

  const { surveyUnitsSuccess } = await getData(PEARL_API_URL, PEARL_AUTHENTICATION_MODE);

  return { surveyUnitsSuccess, surveyUnitsInTempZone };
};
