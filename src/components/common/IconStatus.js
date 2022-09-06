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
  switch (type) {
    case 'success':
      return (
        <CheckCircleOutline
          className={`${classes.success} ${className}`}
          {...other}
          fontSize="large"
        />
      );
    case 'error':
      return <Clear className={`${classes.failure} ${className}`} {...other} fontSize="large" />;
    case 'warning':
      return <Warning className={`${classes.warning} ${className}`} {...other} fontSize="large" />;
    case 'minus':
      return <RemoveIcon className={`${classes.minus} ${className}`} {...other} fontSize="large" />;
    default:
      return <></>;
  }
};
