import React, { useEffect, useState } from 'react';
import { addOnlineStatusObserver } from 'common-tools';
import D from 'i18n';

export default ({ width = 18, height = 18 }) => {
  const [init, setInit] = useState(false);
  const [status, setStatus] = useState(navigator.onLine);
  useEffect(() => {
    if (!init) {
      addOnlineStatusObserver(s => {
        setStatus(s);
      });
      setInit(true);
    }
  }, [init]);

  return (
    <>
      {status && (
        <div id="connexionOK" className="connexion">
          <i class="fa fa-check" aria-hidden="true" />
          &nbsp;
          <span className="online">{D.connexionOK}</span>
        </div>
      )}
      {!status && (
        <div id="connexionKO" className="connexion">
          <i class="fa fa-times" aria-hidden="true" />
          &nbsp;
          <span className="offline">{D.connexionKO}</span>
        </div>
      )}
    </>
  );
};
