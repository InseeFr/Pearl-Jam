import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';

import { Route, useLocation } from 'react-router-dom';

import D from 'i18n';
import { DatabaseConsole } from 'components/panel-body/databaseConsole';
import Home from 'components/panel-body/home';
import Notification from 'components/common/Notification';
import { NotificationWrapper } from 'components/notificationWrapper';
import Palette from 'components/common/palette';
import Preloader from 'components/common/loader';
import { ResetData } from 'components/panel-body/resetData';
import SynchronizeWrapper from 'components/sychronizeWrapper';
import theme from './theme';
import { useAuth } from 'utils/auth/initAuth';
import { useServiceWorker } from 'utils/hooks/useServiceWorker';

function App() {
  const { pathname } = useLocation();
  const { authenticated } = useAuth();
  const serviceWorkerInfo = useServiceWorker(authenticated);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Notification serviceWorkerInfo={serviceWorkerInfo} />
      <div>
        {!authenticated && <Preloader message={D.pleaseWait} />}
        {authenticated && (
          <SynchronizeWrapper>
            <NotificationWrapper>
              {!pathname.startsWith('/support') && (
                <Route path="/" render={routeProps => <Home {...routeProps} />} />
              )}
              <Route path="/support/palette" component={Palette} />
              <Route path="/support/reset-data" component={ResetData} />
              <Route path="/support/database" component={DatabaseConsole} />
            </NotificationWrapper>
          </SynchronizeWrapper>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
