import React from 'react';
import listenQueen from 'common-tools/hooks/listenQueen';
import { useHistory } from 'react-router-dom';

const QueenContainer = queenSwState => {
  const history = useHistory();

  listenQueen(history);

  return (
    <>
      {queenSwState && (
        <div className="queen-app">
          <queen-app />
        </div>
      )}
      {!queenSwState && <h2>Queen service-worker not available.</h2>}
    </>
  );
};

export default QueenContainer;
