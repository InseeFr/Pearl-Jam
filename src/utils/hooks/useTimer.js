import { useEffect } from 'react';
import useAsyncState from './useAsyncState';

const useTimer = setOpen => {
  const [progress, setProgress] = useAsyncState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (progress.current >= 100) {
        clearInterval(timer);
        setOpen(false);
      }
      if (progress.current > 0) setProgress(progress.current >= 100 ? 100 : progress.current + 2);
    }, 75);
    return () => {
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [progress, setProgress];
};

export default useTimer;
