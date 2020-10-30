import React, { useContext } from 'react';
import { Route, Redirect, useHistory } from 'react-router-dom';
import {
  convertSUStateInToDo,
  getLastState,
  isValidForTransmission,
  addNewState,
  isQuestionnaireAvailable,
} from 'common-tools/functions';
import suStateEnum from 'common-tools/enum/SUStateEnum';
import PropTypes from 'prop-types';
import D from 'i18n';
import Navigation from './navigation';
import Details from './details';
import Comments from './comments';
import Contacts from './contacts';
import SurveyUnitContext from './UEContext';
import './router.scss';

const Router = ({ match, saveUE }) => {
  const ue = useContext(SurveyUnitContext);
  const history = useHistory();

  const openQueen = () => {
    history.push(`/queen/questionnaire/${ue.campaign}/survey-unit/${match.params.id}`);
  };

  const save = (unite, url) => {
    saveUE(unite, url);
  };
  const lastState = getLastState(ue);

  const transmit = async () => {
    if (isValidForTransmission(ue)) {
      const newType = suStateEnum.WAITING_FOR_SYNCHRONIZATION.type;
      await addNewState(ue, newType);
      history.push(match.url);
    }
  };

  return (
    <div className="panel-body ue">
      <div className="ue-info">
        <button type="button" className="button-back-home" onClick={() => history.push('/')}>
          <i className="fa fa-arrow-left" aria-hidden="true" />
        </button>
        <div className="infos">
          <div className="small-panel">
            <i className="fa fa-info-circle" aria-hidden="true" />
            <div className="column">
              <div className="row">
                <div>{ue.campaign ? ue.campaign : D.loading}</div>

                <div>
                  {ue.sampleIdentifiers && ue.sampleIdentifiers.ssech
                    ? `${D.suSample}  ${ue.sampleIdentifiers.ssech}`
                    : D.loading}
                </div>
              </div>
              <div>{ue.id ? `${ue.id}` : D.loading}</div>
            </div>
          </div>
          <div className="small-panel">
            <i className="fa fa-user-circle" aria-hidden="true" />
            <div className="column">
              <div>
                {`${ue.lastName ? ue.lastName : D.loading} ${
                  ue.firstName ? ue.firstName : D.loading
                }`}
              </div>
              <div>{ue.geographicalLocation ? ue.geographicalLocation.label : D.loading}</div>
            </div>
          </div>
          <div className="small-panel">
            <i className="fa fa-question-circle" aria-hidden="true" />
            <div className="column">
              {ue.states ? (
                <div className="bold">{convertSUStateInToDo(lastState.type).value}</div>
              ) : (
                D.loading
              )}
            </div>
          </div>
        </div>

        <div className="button-ue">
          <button type="button" disabled={!isQuestionnaireAvailable(ue)} onClick={openQueen}>
            <i className="fa fa-file-text-o" aria-hidden="true" />
            &nbsp;
            {D.questionnaireButton}
          </button>
          <button type="button" onClick={transmit}>
            <i className="fa fa-paper-plane" aria-hidden="true" />
            &nbsp;
            {D.sendButton}
          </button>
        </div>
      </div>

      <div className="sub-page">
        <Navigation />
        <Route
          exact
          path={`${match.url}/details`}
          component={routeProps => <Details {...routeProps} saveUE={save} />}
        />
        <Route
          exact
          path={`${match.url}/comments`}
          component={routeProps => <Comments {...routeProps} saveUE={save} />}
        />
        <Route
          exact
          path={`${match.url}/contacts`}
          component={routeProps => <Contacts {...routeProps} saveUE={save} />}
        />
        <Route exact path={`${match.url}/`}>
          <Redirect to={`${match.url}/details`} />
        </Route>
      </div>
    </div>
  );
};

export default Router;
Router.propTypes = {
  match: PropTypes.object.isRequired,
  saveUE: PropTypes.func.isRequired,
};
