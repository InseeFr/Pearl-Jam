import { Paper } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: '1.5em',
    borderRadius: '15px',
    marginTop: '2em',
    marginLeft: '2em',
    marginRight: '2em',
    height: 'max-content',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  marginBottom: {
    marginBottom: '1em',
  },
  leftMargin: {
    marginLeft: '0.5em',
  },
}));

const GenericTile = ({ title, children, icon: Icon, editionIcon: EditionIcon }) => {
  const classes = useStyles();
  return (
    <Paper className={classes.root} elevation={0}>
      <div className={`${classes.row} ${classes.marginBottom}`}>
        <div className={classes.row}>
          <Icon />
          <Typography variant="h5" className={classes.leftMargin}>
            {title}
          </Typography>
        </div>
        {EditionIcon && <EditionIcon />}
      </div>
      {children}
    </Paper>
  );
};

export default GenericTile;
GenericTile.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  icon: PropTypes.func.isRequired,
};
