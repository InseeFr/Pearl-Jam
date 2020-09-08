import React, { useState, useEffect } from 'react';
import surveyUnitDBService from 'indexedbb/services/surveyUnit-idb-service';
import { useHistory } from 'react-router-dom';
import D from 'i18n';
import { getLastState, addNewState } from 'common-tools/functions';
import suStateEnum from 'common-tools/enum/SUStateEnum';
import { SurveyUnitProvider } from './UEContext';
import Router from './router';

const UEPage = ({ match }) => {
  const [surveyUnit, setSurveyUnit] = useState(undefined);

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

  useEffect(() => {
    if (surveyUnit !== undefined) {
      const lastState = getLastState(surveyUnit);
      if (lastState.type === suStateEnum.NOT_STARTED.type) {
        addNewState(surveyUnit, suStateEnum.IN_PREPARATION.type);
        history.push(history.location.pathname);
      }
    }
  }, [surveyUnit, history]);

  return (
    <div className="panel-body ue">
      <button type="button" className="button-back-home" onClick={() => history.push('/')}>
        {'<<'}
      </button>
      {surveyUnit && (
        <SurveyUnitProvider value={surveyUnit}>
          <Router match={match} saveUE={saveUE} />
        </SurveyUnitProvider>
      )}

      {!surveyUnit && <h2>{`${D.surveyUnitNotFound} ${match.params.id}.`}</h2>}
    </div>
  );
};

export default UEPage;
