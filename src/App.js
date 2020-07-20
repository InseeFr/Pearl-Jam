import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from 'components/panel-body/home';
import ChatPage from 'components/panel-body/chat';
import NotificationsPage from 'components/panel-body/notifications';
import TrainingPage from 'components/panel-body/training';
import QueenContainer from 'components/panel-body/queen-container';
import { useQueenFromConfig } from 'common-tools/hooks/useQueenFromConfig';
import { useAuth } from 'common-tools/auth/initAuth';
import * as serviceWorker from 'serviceWorker';
import Preloader from 'components/common/loader';
import D from 'i18n';
import Notification from 'components/common/Notification';

function App() {
  useQueenFromConfig(`${window.location.origin}/configuration.json`);
  const { authenticated } = useAuth();

  const [installingServiceWorker, setInstallingServiceWorker] = useState(false);
  const [waitingServiceWorker, setWaitingServiceWorker] = useState(null);
  const [isUpdateAvailable, setUpdateAvailable] = useState(false);
  const [isServiceWorkerInstalled, setServiceWorkerInstalled] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);

  const serviceWorkerInfo = {
    installingServiceWorker,
    waitingServiceWorker,
    isUpdateAvailable,
    isServiceWorkerInstalled,
    openNotification,
  };

  useEffect(() => {
    const install = async () => {
      const configuration = await fetch(`${window.location.origin}/configuration.json`);
      const { QUEEN_URL } = await configuration.json();
      serviceWorker.register({
        QUEEN_URL,
        onInstalling: installing => {
          setInstallingServiceWorker(installing);
          setOpenNotification(true);
        },
        onUpdate: registration => {
          setWaitingServiceWorker(registration.waiting);
          setUpdateAvailable(true);
          setOpenNotification(true);
        },
        onWaiting: waiting => {
          setWaitingServiceWorker(waiting);
          setUpdateAvailable(true);
          setOpenNotification(true);
        },
        onSuccess: registration => {
          setInstallingServiceWorker(false);
          setServiceWorkerInstalled(!!registration);
          setOpenNotification(true);
        },
      });
    };
    install();
  }, []);

  return (
    <>
      <Notification serviceWorkerInfo={serviceWorkerInfo} />
      <div className="pearl-container">
        {!authenticated && <Preloader message={D.pleaseWait} />}
        {authenticated && (
          <Router>
            <Switch>
              <Route path="/queen" component={routeProps => <QueenContainer {...routeProps} />} />
              <Route path="/notifications" component={NotificationsPage} />
              <Route path="/chat" component={ChatPage} />
              <Route path="/training" component={TrainingPage} />
              <Route path="/" render={routeProps => <Home {...routeProps} />} />
            </Switch>
          </Router>
        )}
      </div>
    </>
  );
}

export default App;
