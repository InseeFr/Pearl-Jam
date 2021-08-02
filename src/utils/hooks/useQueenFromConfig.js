import { useEffect } from 'react';

export const useQueenFromConfig = url => {
  const importQueenScript = async configurationUrl => {
    const response = await fetch(configurationUrl);
    const { QUEEN_URL } = await response.json();
    const script = document.createElement('script');
    script.src = `${QUEEN_URL}/entry.js`;
    document.body.appendChild(script);
  };

  useEffect(() => {
    importQueenScript(url);
  }, [url]);
};
