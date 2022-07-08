import { Paper, Typography, makeStyles } from '@material-ui/core';

import { ChevronRight } from '@material-ui/icons';
import { IconStatus } from 'components/common/IconStatus';
import React from 'react';

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

const ClickableLine = ({ value, placeholder, checked, onClickFunction }) => {
  const classes = useStyles();

  return (
    <Paper elevation={0} className={classes.row} onClick={onClickFunction}>
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
