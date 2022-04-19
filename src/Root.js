import React, { useEffect, useState } from 'react';
import { useQueenFromConfig } from 'utils/hooks/useQueenFromConfig';
import { BrowserRouter as Router } from 'react-router-dom';
import { useConfiguration } from 'utils/hooks/configuration';
import { addOnlineStatusObserver } from 'utils';
import AppRouter from 'AppRooter';

export const AppContext = React.createContext();

function Root() {
  const { configuration } = useConfiguration();
  useQueenFromConfig(configuration);

  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    addOnlineStatusObserver(s => {
      setOnline(s);
    });
  }, []);

  const context = { ...configuration, online };

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
