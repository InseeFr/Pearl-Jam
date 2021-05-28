import { CssBaseline, ThemeProvider } from '@material-ui/core';
import App from 'App';
import { useQueenFromConfig } from 'common-tools/hooks/useQueenFromConfig';
import QueenContainer from 'components/panel-body/queen-container';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import theme from './theme';

function Root() {
  useQueenFromConfig(`${window.location.origin}/configuration.json`);
  return (
    <Router>
      <Switch>
        <Route path="/queen" component={routeProps => <QueenContainer {...routeProps} />} />
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Route path="/" component={App} />
        </ThemeProvider>
      </Switch>
    </Router>
  );
}

export default Root;
