import React from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { loadConfiguration, useConfiguration } from 'utils/hooks/useConfiguration';
import { PearlTheme } from './ui/PearlTheme';
import { Header } from './ui/Header';
import { Home } from './pages/Home';
import HomeOld from './components/panel-body/home';
import { useAuth } from './utils/auth/initAuth';
import { useServiceWorker } from './utils/hooks/useServiceWorker';
import { ThemeProvider as ThemeProviderV4 } from '@material-ui/styles';
import theme from './theme';
import CssBaseline from '@material-ui/core/CssBaseline';
import Notification from './components/common/Notification';
import { Preloader } from './ui/Preloader';
import D from './i18n/build-dictionary';
import { SyncContextProvider } from './ui/Sync/SyncContextProvider';
import Palette from './components/common/palette';
import { ResetData } from './components/panel-body/resetData';
import { DatabaseConsole } from './components/panel-body/databaseConsole';
import { useEffectOnce } from './utils/hooks/useEffectOnce';
import { SurveyUnitPage } from './pages/SurveyUnitPage';
import './app.css';
import { SuiviPage } from './pages/SuiviPage';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { QueenPage } from './pages/QueenPage';
import { ServiceWorkerStatus } from './ui/ServiceWorkerStatus';

const router = createBrowserRouter([
  {
    path: '/queen/*',
    element: <QueenPage />,
  },
  {
    path: '/',
    element: <AppWrapper />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/suivi',
        element: <SuiviPage />,
      },
      {
        path: '/survey-unit/:id',
        element: (
          <>
            <Outlet />
          </>
        ),
        children: [
          {
            path: 'details',
            element: <SurveyUnitPage />,
          },
        ],
      },
      // TODO : remove this when finished
      {
        path: '/old',
        element: <HomeOld />,
      },
      {
        path: '/support/palette',
        element: <Palette />,
      },
      {
        path: '/support/reset-data',
        element: <ResetData />,
      },
      {
        path: '/support/database',
        element: <DatabaseConsole />,
      },
    ],
  },
]);

export function App() {
  const configuration = useConfiguration();

  useEffectOnce(loadConfiguration, []);

  if (!configuration) {
    return null;
  }

  return <RouterProvider router={router} />;
}

function AppWrapper() {
  const { authenticated } = useAuth();
  const serviceWorkerInfo = useServiceWorker(authenticated);
  console.log({ authenticated });
  serviceWorkerInfo.isUpdateAvailable = true;

  return (
    <PearlTheme>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProviderV4 theme={theme}>
          <CssBaseline />
          <Notification serviceWorkerInfo={serviceWorkerInfo} />
          <ServiceWorkerStatus authenticated={authenticated} />
          <div>
            {authenticated ? (
              <SyncContextProvider>
                <Header />
                <Outlet />
              </SyncContextProvider>
            ) : (
              <Preloader message={D.pleaseWait} />
            )}
          </div>
        </ThemeProviderV4>
      </LocalizationProvider>
    </PearlTheme>
  );
}
