import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';

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
