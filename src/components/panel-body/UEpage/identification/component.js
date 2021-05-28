import { Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

const Identification = () => {
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

export default Identification;
Identification.propTypes = {};
