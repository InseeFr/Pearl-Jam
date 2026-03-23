import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QueenEvent } from 'types/events';

export const useQueenSynchronization = () => {
  const waitTime = 5000;

  const [queenError, setQueenError] = useState(false);
  const [queenReady, setQueenReady] = useState<boolean | null>(true);
  const navigate = useNavigate();

  const checkQueen = () => {
    setQueenReady(null);
    const tooLateErrorThrower = setTimeout(() => {
      setQueenError(true);
      setQueenReady(true);
    }, waitTime);

    const handleQueenEvent = async (event: QueenEvent) => {
      const { type, command, state } = event.detail;
      if (type === 'QUEEN' && command === 'HEALTH_CHECK') {
        clearTimeout(tooLateErrorThrower);
        if (state === 'READY') {
          setQueenError(false);
          setQueenReady(true);
          console.log('Queen is ready');
        } else {
          setQueenError(true);
          setQueenReady(true);
          console.log('Queen is not ready');
        }
      }
    };
    const removeQueenEventListener = () => {
      globalThis.removeEventListener('QUEEN', handleQueenEvent);
    };

    globalThis.addEventListener('QUEEN', handleQueenEvent);

    const data = { type: 'PEARL', command: 'HEALTH_CHECK' };
    const event = new CustomEvent('PEARL', { detail: data });
    globalThis.dispatchEvent(event);
    setTimeout(() => removeQueenEventListener(), waitTime);
  };

  const synchronizeQueen = useCallback(() => {
    navigate(`/queen/synchronize`);
  }, [navigate]);

  return { checkQueen, synchronizeQueen, queenReady, queenError };
};
