import React from 'react';
import { CheckCircleOutline, Warning, Clear } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  success: {
    color: theme.palette.success.main,
  },
  failure: {
    color: theme.palette.error.main,
  },
  warning: {
    color: theme.palette.warning.main,
  },
}));

export const IconStatus = ({ type, ...other }) => {
  const classes = useStyles();
  if (type === 'success')
    return <CheckCircleOutline className={classes.success} {...other} fontSize="large" />;
  if (type === 'error') return <Clear className={classes.failure} {...other} fontSize="large" />;
  if (type === 'warning')
    return <Warning className={classes.warning} {...other} fontSize="large" />;
  return <></>;
};
