import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { enUS, fr } from 'date-fns/locale';
import { lazy, Suspense } from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import './app.css';
import { DevTools } from './devtools';
import D from './i18n/build-dictionary';
import { Home } from './pages/Home';
import { ResetData } from './pages/ResetData';
import { SurveyUnitPage } from './pages/SurveyUnitPage';
import { Header } from './ui/Header';
import { PearlTheme } from './ui/PearlTheme';
import { Preloader } from './ui/Preloader';
import { ServiceWorkerStatus } from './ui/ServiceWorkerStatus';
import { SyncContextProvider } from './ui/Sync/SyncContextProvider';
import { useAuth } from './utils/auth/initAuth';

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
        lazy: () => import('./pages/TrackingPage'),
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
              <main>
                <Outlet />
              </main>
            </SyncContextProvider>
          ) : (
            <Preloader message={D.pleaseWait} />
          )}
        </div>
      </LocalizationProvider>
      {import.meta.env.DEV && <DevTools />}
    </PearlTheme>
  );
}
