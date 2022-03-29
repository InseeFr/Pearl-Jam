import React from 'react';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import Warning from '@material-ui/icons/Warning';
import Clear from '@material-ui/icons/Clear';
import { makeStyles } from '@material-ui/core/styles';

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
