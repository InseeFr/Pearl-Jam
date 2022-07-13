import ChevronRight from '@material-ui/icons/ChevronRight';
import { IconStatus } from 'components/common/IconStatus';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
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
}));

const ClickableLine = ({ value, placeholder, checked, onClickFunction, key }) => {
  const classes = useStyles();

  return (
    <Paper elevation={0} className={classes.row} onClick={onClickFunction} key={key}>
      <Typography className={classes.marginRight}>{value ? value : placeholder}</Typography>
      <div className={classes.rightAligned}>
        {checked && <IconStatus type={'success'} />}
        <ChevronRight />
      </div>
    </Paper>
  );
};

export default ClickableLine;
ClickableLine.propTypes = {};
