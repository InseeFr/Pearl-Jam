import { useEffect } from 'react';

export const useQueenFromConfig = configuration => {
  const importQueenScript = configuration => {
    const { QUEEN_URL } = configuration;
    const script = document.createElement('script');
    script.src = `${QUEEN_URL}/entry.js`;
    document.body.appendChild(script);
  };

  useEffect(() => {
    if (configuration) importQueenScript(configuration);
  }, [configuration]);
};
