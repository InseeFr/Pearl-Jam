import React, { lazy, Suspense } from 'react';
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
import { ServiceWorkerStatus } from './ui/ServiceWorkerStatus';
import { ResetData } from './pages/ResetData';
import { enUS, fr } from 'date-fns/locale';

const QueenPage = lazy(() => import('./pages/QueenPage'));

const router = createBrowserRouter([
  {
    path: '/queen/*',
    element: (
      <Suspense>
        <QueenPage />
      </Suspense>
    ),
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
      {
        path: '/support/reset-data',
        element: <ResetData />,
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
  const browserLanguage = navigator.language;
  let dateFnsLocale;
  switch (browserLanguage) {
    case 'fr':
    case 'fr-FR':
      dateFnsLocale = fr;
      break;
    case 'en-US':
    case 'en':
    default:
      dateFnsLocale = enUS;
      break;
  }

  return (
    <PearlTheme>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={dateFnsLocale}>
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
