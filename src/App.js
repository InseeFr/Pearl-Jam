import { useAuth } from 'utils/auth/initAuth';
import useServiceWorker from 'utils/hooks/useServiceWorker';
import Preloader from 'components/common/loader';
import Notification from 'components/common/Notification';
import { ThemeProvider, CssBaseline } from '@material-ui/core';
import theme from './theme';
import Palette from 'components/common/palette';
import Home from 'components/panel-body/home';
import D from 'i18n';
import React from 'react';
import { Route, useLocation } from 'react-router-dom';
import SynchronizeWrapper from 'components/sychronizeWrapper';
import { NotificationWrapper } from 'components/notificationWrapper';
import { ResetData } from 'components/panel-body/resetData';

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
            </NotificationWrapper>
          </SynchronizeWrapper>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
