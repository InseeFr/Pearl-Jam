import { makeStyles, Paper, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles(() => ({
  root: {
    padding: 8,
    borderRadius: 15,
    border: ' LightGray solid 2px',
    width: 'max-content',
    display: 'flex',
    flexDirection: 'column',
    margin: '10px',
  },
  label: { fontWeight: 'bold' },
}));

const DetailTile = ({ label, children }) => {
  const classes = useStyles();
  return (
    <Paper className={classes.root} elevation={0}>
      <Typography className={classes.label}>{label}</Typography>
      {children}
    </Paper>
  );
};

export default DetailTile;
DetailTile.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
