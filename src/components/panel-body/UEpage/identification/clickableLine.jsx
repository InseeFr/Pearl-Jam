import ChevronRight from '@material-ui/icons/ChevronRight';
import MaterialIcons from 'utils/icons/materialIcons';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { grey } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  row: {
    display: 'flex',
    flexDirection: 'row',
    minHeight: '3em',
    borderRadius: '15px',
    justifyContent: 'space-between',
    backgroundColor: grey[100],
    alignItems: 'center',
    '&:hover': { backgroundColor: grey[300], cursor: 'pointer' },
    paddingLeft: '1em',
    gap: '0.5em',
  },
  selected: {
    backgroundColor: grey[300],
  },
  disabled: {
    color: theme.palette.text.secondary,
  },
}));

const ClickableLine = ({ value, placeholder, checked, onClickFunction, selected, disabled }) => {
  const { row, selected: selectedClass, disabled: disabledClass } = useStyles();

  return (
    <Paper
      elevation={0}
      className={clsx(row, selected ? selectedClass : '', disabled ? disabledClass : '')}
      onClick={onClickFunction}
      key={`${value}-${placeholder}`}
    >
      <Typography>{value ?? placeholder}</Typography>
      <div>
        {checked && <MaterialIcons type="success" />}
        {disabled && <MaterialIcons type="remove" />}
        <ChevronRight />
      </div>
    </Paper>
  );
};

export default ClickableLine;
ClickableLine.propTypes = {};
