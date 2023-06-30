import { Paper } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1em',
    padding: '1.5em',
    borderRadius: '15px',
    margin: '2em',
    height: 'max-content',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: '1em',
  },
}));

const GenericTile = ({ title, children, icon, editionIcon }) => {
  const classes = useStyles();
  return (
    <Paper className={classes.root} elevation={0}>
      <div className={classes.row}>
        <div className={classes.row}>
          {icon}
          <Typography variant="h5">{title}</Typography>
        </div>
        {editionIcon}
      </div>
      {children}
    </Paper>
  );
};

export default GenericTile;
GenericTile.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  icon: PropTypes.node.isRequired,
};
