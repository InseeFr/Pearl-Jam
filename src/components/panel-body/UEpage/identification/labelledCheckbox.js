import { Divider, Paper, Radio, Typography, makeStyles } from '@material-ui/core';

import React from 'react';

const useStyles = makeStyles(() => ({
  row: {
    display: 'flex',
    flexDirection: 'row',
    borderRadius: '15px',
    justifyContent: 'flex-start',
    alignItems: 'center',
    '&:hover': { backgroundColor: 'lightgrey', cursor: 'pointer' },
    paddingLeft: '1em',
    margin: '5px',
  },
  line: {
    minWidth: '20em',
  },
}));

const LabelledCheckbox = ({ value, checked, onClickFunction }) => {
  const classes = useStyles();

  return (
    <Paper elevation={0} className={classes.row} onClick={onClickFunction}>
      <Radio checked={checked} />
      <Divider orientation="vertical" flexItem />
      <Typography>{value}</Typography>
    </Paper>
  );
};

export default LabelledCheckbox;
LabelledCheckbox.propTypes = {};
