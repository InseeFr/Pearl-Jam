import App from 'App';
import QueenContainer from 'components/panel-body/queen-container';
import React from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';

function AppRooter() {
  const { pathname } = useLocation();

  return (
    <Switch>
      <Route path="/queen" component={routeProps => <QueenContainer {...routeProps} />} />
      {!pathname.startsWith('/queen') && <Route path="/" component={App} />}
    </Switch>
  );
}

export default AppRooter;
