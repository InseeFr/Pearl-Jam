import React, { useEffect, useMemo, useState } from 'react';

import AppRouter from 'AppRooter';
import { BrowserRouter as Router } from 'react-router-dom';
import { addOnlineStatusObserver } from 'utils';
import { useConfiguration } from 'utils/hooks/configuration';

export const AppContext = React.createContext();

function Root() {
  const { configuration } = useConfiguration();
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    addOnlineStatusObserver(s => {
      setOnline(s);
    });
  }, []);

  const context = useMemo(() => ({ ...configuration, online }), [configuration]);

  return (
    <>
      {configuration && (
        <Router>
          <AppContext.Provider value={context}>
            <AppRouter />
          </AppContext.Provider>
        </Router>
      )}
    </>
  );
}

export default Root;
