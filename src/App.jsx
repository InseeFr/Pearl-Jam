import React from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { loadConfiguration, useConfiguration } from './utils/hooks/useConfiguration';
import { PearlTheme } from './ui/PearlTheme';
import { Header } from './ui/Header';
import { Home } from './pages/Home';
import { useAuth } from './utils/auth/initAuth';
import { Preloader } from './ui/Preloader';
import D from './i18n/build-dictionary';
import { SyncContextProvider } from './ui/Sync/SyncContextProvider';
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
        element: <Outlet />,
        children: [
          {
            path: 'details',
            element: <SurveyUnitPage />,
          },
        ],
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

  return (
    <PearlTheme>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
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
      </LocalizationProvider>
    </PearlTheme>
  );
}
