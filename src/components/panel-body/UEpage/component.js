import React, { useState, useEffect } from 'react';
import surveyUnitDBService from 'indexedbb/services/surveyUnit-idb-service';
import { useHistory } from 'react-router-dom';
import D from 'i18n';
import { SurveyUnitProvider } from './UEContext';
import Router from './router';

const UEPage = ({ match }) => {
  const [surveyUnit, setSurveyUnit] = useState({});

  const history = useHistory();

  useEffect(() => {
    let init = false;
    surveyUnitDBService.getById(match.params.id).then(ue => {
      if (!init) {
        setSurveyUnit(ue);
      }
    });

    return () => {
      init = true;
    };
  }, [match]);

  const saveUE = (ue, url) => {
    setSurveyUnit(ue);
    surveyUnitDBService.update(ue);
    history.push(url); //force to update
  };

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
          <h2>{`${D.surveyUnitNotFound} ${match.params.id}.`}</h2>
        </>
      )}
    </>
  );
};

export default UEPage;
