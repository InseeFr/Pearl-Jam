import { makeStyles } from '@material-ui/core';
import listenQueen from 'common-tools/hooks/listenQueen';
import React from 'react';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  queenApp: {
    backgroundColor: theme.palette.primary.main,
  },
}));

const QueenContainer = queenSwState => {
  const history = useHistory();
  const classes = useStyles();
  listenQueen(history);

  return (
    <>
      {queenSwState && (
        <div className={classes.queenApp}>
          <queen-app />
        </div>
      )}
      {!queenSwState && <h2>Queen service-worker not available.</h2>}
    </>
  );
};

export default QueenContainer;
