import suStateEnum from 'common-tools/enum/SUStateEnum';
import { addNewState, getLastState } from 'common-tools/functions';
import D from 'i18n';
import surveyUnitDBService from 'indexedbb/services/surveyUnit-idb-service';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Router from './router';
import { SurveyUnitProvider } from './UEContext';

const UEPage = ({ match }) => {
  const [surveyUnit, setSurveyUnit] = useState(undefined);

  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    surveyUnitDBService.getById(id).then(ue => {
      setSurveyUnit(ue);
    });
  }, [id]);

  const saveUE = (ue, url) => {
    setSurveyUnit(ue);
    surveyUnitDBService.update(ue);
    history.push(url); // force to update
  };

  useEffect(() => {
    if (surveyUnit !== undefined) {
      const lastState = getLastState(surveyUnit);
      if (lastState.type === suStateEnum.VISIBLE_AND_CLICKABLE.type) {
        addNewState(surveyUnit, suStateEnum.IN_PREPARATION.type);
        history.push(history.location.pathname);
      }
    }
  }, [surveyUnit, history]);

  return (
    <>
      {surveyUnit && (
        <SurveyUnitProvider value={surveyUnit}>
          <Router match={match} saveUE={saveUE} />
        </SurveyUnitProvider>
      )}

      {!surveyUnit && (
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
};
