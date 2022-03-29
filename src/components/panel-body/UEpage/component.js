import React, { useEffect, useState } from 'react';
import { addNewState, getLastState } from 'utils/functions';
import { useHistory, useParams } from 'react-router-dom';
import D from 'i18n';
import PropTypes from 'prop-types';
import Router from './router';
import { SurveyUnitProvider } from './UEContext';
import surveyUnitMissingIdbService from 'utils/indexeddb/services/surveyUnitMissing-idb-service';
import { surveyUnitStateEnum } from 'utils/enum/SUStateEnum';
import { useSurveyUnit } from 'utils/hooks/database';

const UEPage = ({ match }) => {
  const [inaccessible, setInaccessible] = useState(false);
  const [loading, setLoading] = useState(true);

  const history = useHistory();
  const { id } = useParams();
  const surveyUnit = useSurveyUnit(id);

  useEffect(() => {
    const updateSurveyUnit = async () => {
      setLoading(true);
      const isMissing = await surveyUnitMissingIdbService.getById(id);
      setInaccessible(!!isMissing);
      setLoading(false);
    };
    if (surveyUnit) {
      updateSurveyUnit();
    }
  }, [id, surveyUnit]);

  useEffect(() => {
    if (surveyUnit !== undefined) {
      const lastState = getLastState(surveyUnit);
      if (lastState.type === surveyUnitStateEnum.VISIBLE_AND_CLICKABLE.type) {
        addNewState(surveyUnit, surveyUnitStateEnum.IN_PREPARATION.type);
      }
    }
  }, [surveyUnit]);

  return (
    <>
      {surveyUnit && !loading && (
        <SurveyUnitProvider value={{ surveyUnit, inaccessible }}>
          <Router match={match} />
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
