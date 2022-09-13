import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { grey } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  row: {
    display: 'flex',
    flexDirection: 'row',
    borderRadius: '15px',
    justifyContent: 'flex-start',
    alignItems: 'center',
    '&:hover': { backgroundColor: 'lightgrey', cursor: 'pointer' },
    backgroundColor: grey[100],
    margin: '5px',
    gap: '0.5em',
  },
  line: {
    minWidth: '20em',
  },
}));

const LabelledCheckbox = ({ value, checked, onClickFunction }) => {
  const classes = useStyles();

  return (
    <Paper elevation={0} className={classes.row} onClick={onClickFunction} key={value}>
      <Radio checked={checked} />
      <Divider orientation="vertical" flexItem />
      <Typography>{value}</Typography>
    </Paper>
  );
};

export default LabelledCheckbox;
LabelledCheckbox.propTypes = {};
