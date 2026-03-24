import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

import { monitoringService } from './core/monitoring';

if (monitoringService.isActive()) {
  console.log('MONTIRING is active');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
