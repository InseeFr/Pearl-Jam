import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import Clear from '@material-ui/icons/Clear';
import React from 'react';
import RemoveIcon from '@material-ui/icons/Remove';
import Warning from '@material-ui/icons/Warning';
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
  minus: {
    color: theme.palette.primary.darker,
  },
}));

export const IconStatus = ({ type, className, ...other }) => {
  const classes = useStyles();
  if (type === 'success')
    return (
      <CheckCircleOutline
        className={`${classes.success} ${className}`}
        {...other}
        fontSize="large"
      />
    );
  if (type === 'error')
    return <Clear className={`${classes.failure} ${className}`} {...other} fontSize="large" />;
  if (type === 'warning')
    return <Warning className={`${classes.warning} ${className}`} {...other} fontSize="large" />;
  if (type === 'minus')
    return <RemoveIcon className={`${classes.minus} ${className}`} {...other} fontSize="large" />;
  return <></>;
};
