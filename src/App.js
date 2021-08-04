import { useAuth } from 'utils/auth/initAuth';
import useServiceWorker from 'utils/hooks/useServiceWorker';
import Preloader from 'components/common/loader';
import Notification from 'components/common/Notification';
import Palette from 'components/common/palette';
import Home from 'components/panel-body/home';
import TrainingPage from 'components/panel-body/training';
import D from 'i18n';
import React from 'react';
import { Route } from 'react-router-dom';
import SynchronizeWrapper from 'components/sychronizeWrapper';

function App() {
  const { authenticated } = useAuth();
  const serviceWorkerInfo = useServiceWorker(authenticated);

  return (
    <>
      <Notification serviceWorkerInfo={serviceWorkerInfo} />
      <div>
        {!authenticated && <Preloader message={D.pleaseWait} />}
        {authenticated && (
          <SynchronizeWrapper>
            <Route path="/" render={routeProps => <Home {...routeProps} />} />
            <Route path="/training" component={TrainingPage} />
            <Route path="/palette" component={Palette} />
          </SynchronizeWrapper>
        )}
      </div>
    </>
  );
}

export default App;
