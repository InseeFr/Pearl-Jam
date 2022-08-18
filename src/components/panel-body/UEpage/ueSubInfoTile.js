import MaterialIcons from 'utils/icons/materialIcons';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    scrollMarginTop: '3em',
    padding: '1em',
    borderRadius: '15px',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
}));

const UeSubInfoTile = ({ title, children, className, iconType = 'user' }) => {
  const classes = useStyles();
  return (
    <div className={`${classes.root} ${className}`}>
      <div className={classes.row}>
        <Typography variant="h5">{title}</Typography>
        <MaterialIcons type={iconType} />
      </div>
      {children}
    </div>
  );
};

export default UeSubInfoTile;
UeSubInfoTile.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
UeSubInfoTile.defaultProps = {
  className: '',
};
