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
import DateFnsUtils from '@date-io/date-fns';
import frLocale from 'date-fns/locale/fr';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

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
  const initDate = new Date('2021-01-01T10:30:00');
  const [lastConfirmation, setLastConfirmation] = useState(false);
  const [userDate, setUserDate] = useState(initDate);
  const [userDateError, setUserDateError] = useState(false);

  const handleChange = newValue => {
    setUserDateError(false);
    setUserDate(newValue);
  };

  const validDate = () => {
    const now = new Date();
    const dateToConfirm = new Date(userDate);
    const diff = differenceInMinutes(now, dateToConfirm);
    if (diff === 0) {
      setLastConfirmation(false);
      setUserDate(initDate);
      setUserDateError(false);
      agreeFunction();
    } else setUserDateError(true);
  };

  const confirm = e => {
    setLastConfirmation(true);
  };
  const cancel = e => {
    setLastConfirmation(false);
    setUserDate(initDate);
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
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={frLocale}>
              <DateTimePicker
                renderInput={props => <TextField {...props} />}
                ampm={false}
                error={userDateError}
                helperText={userDateError ? D.dateError : null}
                value={userDate}
                onChange={handleChange}
                disableHighlightToday
                format="dd/MM/yyyy - HH:mm"
              />
            </MuiPickersUtilsProvider>
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
