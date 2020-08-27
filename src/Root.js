import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import QueenContainer from 'components/panel-body/queen-container';
import { useQueenFromConfig } from 'common-tools/hooks/useQueenFromConfig';
import App from 'App';

function Root() {
  useQueenFromConfig(`${window.location.origin}/configuration.json`);
  return (
    <Router>
      <Switch>
        <Route path="/queen" component={routeProps => <QueenContainer {...routeProps} />} />
        <Route path="/" component={App} />
      </Switch>
    </Router>
  );
}

export default Root;
