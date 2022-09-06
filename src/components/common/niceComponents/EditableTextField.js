import React from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '1em',
  },
  marginRight: {
    marginRight: '1em',
  },
}));

export const EditableTextField = ({ id, label, defaultValue = '', onChangeFunction }) => {
  const classes = useStyles();
  return (
    <div className={classes.row}>
      <Typography className={classes.marginRight} color="textSecondary">
        {label}
      </Typography>
      <TextField
        margin="dense"
        id={id}
        name={id}
        InputLabelProps={{ color: 'secondary' }}
        type="text"
        fullWidth
        defaultValue={defaultValue}
        onChange={event => onChangeFunction(event)}
      />
    </div>
  );
};
