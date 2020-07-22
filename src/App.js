import React from 'react';
import { Route } from 'react-router-dom';
import Home from 'components/panel-body/home';
import ChatPage from 'components/panel-body/chat';
import NotificationsPage from 'components/panel-body/notifications';
import TrainingPage from 'components/panel-body/training';
import useServiceWorker from 'common-tools/hooks/useServiceWorker';
import { useAuth } from 'common-tools/auth/initAuth';
import Preloader from 'components/common/loader';
import D from 'i18n';
import Notification from 'components/common/Notification';
import Navigation from 'components/common/navigation';

function App() {
  const { authenticated } = useAuth();
  const serviceWorkerInfo = useServiceWorker(authenticated);
  return (
    <>
      <Notification serviceWorkerInfo={serviceWorkerInfo} />
      <div className="pearl-container">
        {!authenticated && <Preloader message={D.pleaseWait} />}
        {authenticated && (
          <>
            <Navigation />
            <Route path="/notifications" component={NotificationsPage} />
            <Route path="/chat" component={ChatPage} />
            <Route path="/training" component={TrainingPage} />
            <Route path="/" render={routeProps => <Home {...routeProps} />} />
          </>
        )}
      </div>
    </>
  );
}

export default App;
