import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useQueenSynchronization = () => {
  const navigate = useNavigate();

  const synchronizeQueen = useCallback(() => {
    navigate(`/queen/synchronize`);
  }, [navigate]);

  return { synchronizeQueen };
};
