import React, { useEffect, useState } from 'react';
import { addNewState, getLastState } from 'utils/functions';
import { useHistory, useParams } from 'react-router-dom';

import D from 'i18n';
import PropTypes from 'prop-types';
import Router from './router';
import { SurveyUnitProvider } from './UEContext';
import surveyUnitDBService from 'indexedbb/services/surveyUnit-idb-service';
import surveyUnitMissingIdbService from 'indexedbb/services/surveyUnitMissing-idb-service';
import { surveyUnitStateEnum } from 'utils/enum/SUStateEnum';

const UEPage = ({ match, refresh: homeRefresh }) => {
  const [surveyUnit, setSurveyUnit] = useState(undefined);
  const [shouldRefresh, setShouldRefresh] = useState(true);
  const [inaccessible, setInaccessible] = useState(false);
  const [loading, setLoading] = useState(true);

  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    const updateSurveyUnit = async () => {
      setLoading(true);
      const ue = await surveyUnitDBService.getById(id);
      if (ue) setSurveyUnit({ ...ue });
      const isMissing = await surveyUnitMissingIdbService.getById(id);
      if (isMissing) setInaccessible(true);
      setLoading(false);
    };
    if (shouldRefresh) {
      updateSurveyUnit();
      setShouldRefresh(false);
    }
  }, [id, shouldRefresh]);

  const refresh = () => {
    setShouldRefresh(true);
    homeRefresh();
  };

  const saveUE = ue => {
    setSurveyUnit(ue);
    surveyUnitDBService.update(ue);
    // history.push(url); // force to update
  };

  useEffect(() => {
    if (surveyUnit !== undefined) {
      const lastState = getLastState(surveyUnit);
      if (lastState.type === surveyUnitStateEnum.VISIBLE_AND_CLICKABLE.type) {
        addNewState(surveyUnit, surveyUnitStateEnum.IN_PREPARATION.type);
        history.push(history.location.pathname);
      }
    }
  }, [surveyUnit, history]);

  return (
    <>
      {surveyUnit && !loading && (
        <SurveyUnitProvider value={{ surveyUnit, inaccessible }}>
          <Router match={match} saveUE={saveUE} refresh={refresh} />
        </SurveyUnitProvider>
      )}

      {!surveyUnit && !loading && (
        <>
          <button type="button" className="button-back-home" onClick={() => history.push('/')}>
            <i className="fa fa-arrow-left" aria-hidden="true" />
          </button>
          <h2>{`${D.surveyUnitNotFound} ${id}.`}</h2>
        </>
      )}
    </>
  );
};

export default UEPage;
UEPage.propTypes = {
  match: PropTypes.shape({}).isRequired,
  refresh: PropTypes.func.isRequired,
};
