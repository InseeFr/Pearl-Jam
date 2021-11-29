import listenQueen from 'utils/hooks/listenQueen';
import React from 'react';
import { useHistory } from 'react-router-dom';

const QueenContainer = queenSwState => {
  const history = useHistory();
  listenQueen(history);

  return (
    <>
      {queenSwState && <queen-app />}
      {!queenSwState && <h2>Queen service-worker not available.</h2>}
    </>
  );
};

export default QueenContainer;
