import ChevronRight from '@material-ui/icons/ChevronRight';
import { IconStatus } from 'components/common/IconStatus';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  row: {
    display: 'flex',
    flexDirection: 'row',
    borderRadius: '15px',
    justifyContent: 'flex-end',
    alignItems: 'center',
    '&:hover': { backgroundColor: 'lightgrey', cursor: 'pointer' },
    paddingLeft: '1em',
    margin: '5px',
  },
  rightAligned: { marginLeft: 'auto' },
  selected: {
    backgroundColor: 'lightgrey',
  },
  disabled: {
    color: theme.palette.text.secondary,
  },
}));

const ClickableLine = ({ value, placeholder, checked, onClickFunction, selected, disabled }) => {
  const classes = useStyles();
  const calculatedClasses = `${classes.row} ${selected && classes.selected} ${disabled &&
    classes.disabled}`;

  return (
    <Paper
      elevation={0}
      className={calculatedClasses}
      onClick={onClickFunction}
      key={`${value}-${placeholder}`}
    >
      <Typography className={classes.marginRight}>{value ?? placeholder}</Typography>
      <div className={classes.rightAligned}>
        {checked && <IconStatus type={'success'} />}
        {disabled && <IconStatus type={'minus'} />}
        <ChevronRight />
      </div>
    </Paper>
  );
};

export default ClickableLine;
ClickableLine.propTypes = {};
