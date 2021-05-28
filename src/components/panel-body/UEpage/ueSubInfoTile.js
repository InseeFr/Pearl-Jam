import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    scrollMarginTop: '3em',
    padding: '1em',
    borderRadius: '15px',
  },
}));

const UeSubInfoTile = ({ title, children, reference, className }) => {
  const classes = useStyles();
  return (
    <div className={`${classes.root} ${className}`} ref={reference}>
      <Typography variant="h5">{title}</Typography>
      {children}
    </div>
  );
};

export default UeSubInfoTile;
UeSubInfoTile.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  reference: PropTypes.shape({}).isRequired,
  className: PropTypes.string,
};
UeSubInfoTile.defaultProps = {
  className: '',
};
