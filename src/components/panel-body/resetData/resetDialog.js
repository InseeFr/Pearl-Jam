import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
  TextField,
} from '@material-ui/core';
import D from 'i18n';
import React, { useState } from 'react';
import { differenceInMinutes } from 'date-fns';

const useStyles = makeStyles(theme => ({
  agreeBtn: {
    backgroundColor: theme.palette.error.main,
  },
  disagreeBtn: {
    backgroundColor: theme.palette.success.main,
  },
}));

export const ResetDialog = ({
  open,
  title,
  body,
  agree,
  disagree,
  agreeFunction,
  disagreeFunction,
  last = false,
}) => {
  const classes = useStyles();

  const [lastConfirmation, setLastConfirmation] = useState(false);
  const [userDate, setUserDate] = useState(null);
  const [userDateError, setUserDateError] = useState(false);

  const handleChange = event => {
    setUserDateError(false);
    setUserDate(event.target.value);
  };

  const validDate = () => {
    const now = new Date();
    const dateToConfirm = new Date(userDate);
    const diff = differenceInMinutes(now, dateToConfirm);
    if (diff === 0) {
      setLastConfirmation(false);
      setUserDate(null);
      setUserDateError(false);
      agreeFunction();
    } else setUserDateError(true);
  };

  const confirm = e => {
    setLastConfirmation(true);
  };
  const cancel = e => {
    setLastConfirmation(false);
    setUserDate(null);
    setUserDateError(false);
    disagreeFunction(e);
  };

  const localDisagreeFunction = last ? cancel : disagreeFunction;

  const localAgreeFunction = last ? confirm : agreeFunction;

  return (
    <Dialog open={open} onClose={localDisagreeFunction}>
      <DialogTitle>{title}</DialogTitle>
      {!lastConfirmation && (
        <>
          <DialogContent>
            <DialogContentText>{body}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={localAgreeFunction} className={classes.agreeBtn}>
              {agree}
            </Button>
            <Button onClick={localDisagreeFunction} className={classes.disagreeBtn}>
              {disagree}
            </Button>
          </DialogActions>
        </>
      )}
      {lastConfirmation && (
        <>
          <DialogContent>
            <DialogContentText>{D.confirmDate}</DialogContentText>
            <TextField
              error={userDateError}
              helperText={userDateError ? D.dateError : null}
              margin="dense"
              defaultValue="2021-01-01T10:30"
              id="name"
              type="datetime-local"
              value={userDate}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={validDate} className={classes.agreeBtn}>
              {D.confirmButton}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};
