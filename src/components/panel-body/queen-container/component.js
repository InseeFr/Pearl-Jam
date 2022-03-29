import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import listenQueen from 'utils/hooks/listenQueen';
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
