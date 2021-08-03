import { CssBaseline, ThemeProvider } from '@material-ui/core';
import App from 'App';
import { useQueenFromConfig } from 'utils/hooks/useQueenFromConfig';
import QueenContainer from 'components/panel-body/queen-container';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import theme from './theme';
import { useConfiguration } from 'utils/hooks/configuration';

export const AppContext = React.createContext();

function Root() {
  const { configuration } = useConfiguration();
  useQueenFromConfig(configuration);
  return (
    <>
      {configuration && (
        <Router>
          <Switch>
            <Route path="/queen" component={routeProps => <QueenContainer {...routeProps} />} />
            <AppContext.Provider value={configuration}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <Route path="/" component={App} />
              </ThemeProvider>
            </AppContext.Provider>
          </Switch>
        </Router>
      )}
    </>
  );
}

export default Root;
