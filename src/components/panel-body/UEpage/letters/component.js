import React from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

const Letters = () => {
  const useStyles = makeStyles(() => ({
    void: {
      height: '200px',
      width: '200px',
      boxShadow: 'unset',
      borderRadius: '15px',
      border: 'LightGray solid 1px',
    },
  }));

  const classes = useStyles();

  return <Paper className={classes.void} />;
};

export default Letters;
Letters.propTypes = {};
