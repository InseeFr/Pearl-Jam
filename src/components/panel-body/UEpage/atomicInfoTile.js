import { Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MaterialIcons from 'common-tools/icons/materialIcons';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles(theme => ({
  root: {
    padding: 8,
    borderRadius: 15,
    '&:hover': { cursor: 'pointer' },
    border: ' LightGray solid 1px',
    minHeight: 130,
    width: 'max-content',
    minWidth: '200px',
    display: 'flex',
    flexDirection: 'column',
    margin: '10px',
  },
  firstLine: {
    alignSelf: 'flex-end',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: { fontWeight: 'bold', marginRight: '0.5em' },
  invisible: { color: theme.palette.primary.main },
}));

const AtomicInfoTile = ({ iconType, data, onClickFunction }) => {
  const classes = useStyles();
  const labels = data.reduce(
    (arr, { label }) => [
      ...arr,
      <Typography key={label} className={classes.label}>
        {label !== undefined ? label : ''}
      </Typography>,
    ],
    []
  );
  //TODO su fucntions getData for mail => add favorite attribute
  const values = data.reduce((arr, { label, value, favorite }) => {
    const valid = value !== undefined && value !== '';
    return [
      ...arr,
      <div className={classes.row}>
        {favorite !== undefined && <MaterialIcons type={favorite ? 'starFull' : 'starOutlined'} />}
        <Typography key={label} className={valid ? '' : classes.invisible}>
          {value !== undefined && value !== '' ? value : '-'}
        </Typography>
      </div>,
    ];
  }, []);

  return (
    <Paper className={classes.root} onClick={() => onClickFunction()} variant="outlined">
      <div className={classes.firstLine}>
        <MaterialIcons type={iconType} />
      </div>
      <div className={classes.row}>
        <div key="labels" className={classes.column}>
          {[...labels]}
        </div>
        <div key="values" className={classes.column}>
          {[...values]}
        </div>
      </div>
    </Paper>
  );
};

export default AtomicInfoTile;
AtomicInfoTile.propTypes = {
  iconType: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({ key: PropTypes.string, value: PropTypes.string }))
    .isRequired,
  onClickFunction: PropTypes.func.isRequired,
};
