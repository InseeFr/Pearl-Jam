import React from 'react';
import AppLegacy from 'AppLegacy';
import QueenContainer from 'components/panel-body/queen-container';
import { Route, Switch, useLocation } from 'react-router-dom';

function AppRooterLegacy() {
  const { pathname } = useLocation();

  return (
    <Switch>
      <Route path="/queen" component={routeProps => <QueenContainer {...routeProps} />} />
      {!pathname.startsWith('/queen') && <Route path="/" component={AppLegacy} />}
    </Switch>
  );
}

export default AppRooterLegacy;
