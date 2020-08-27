import React from 'react';
import { Route } from 'react-router-dom';
import UEPage from 'components/panel-body/UEpage';
import UESPage from 'components/panel-body/UESpage';

const Home = ({ match }) => {
  return (
    <div className="home">
      <Route path="/survey-unit/:id" component={routeProps => <UEPage {...routeProps} />} />
      <Route exact path={`${match.url}`} component={routeProps => <UESPage {...routeProps} />} />
    </div>
  );
};

export default Home;
