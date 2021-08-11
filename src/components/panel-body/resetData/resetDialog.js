import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import D from 'i18n';
import React, { useState } from 'react';

const useStyles = makeStyles(theme => ({
  agreeBtn: {
    backgroundColor: theme.palette.error.main,
  },
  disagreeBtn: {
    backgroundColor: theme.palette.success.main,
  },
  randomText: {
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: '1.5px',
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

  const getRandomText = () =>
    Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase();

  const [randomText, setRandomText] = useState(() => getRandomText());
  const [lastConfirmation, setLastConfirmation] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [userInputError, setUserInputError] = useState(false);

  const clean = () => {
    setLastConfirmation(false);
    setUserInput('');
    setUserInputError(false);
    setRandomText(getRandomText());
  };

  const handleChange = event => {
    setUserInputError(false);
    setUserInput(event.target.value);
  };

  const validateInput = () => {
    if (userInput === randomText) {
      clean();
      agreeFunction();
    } else setUserInputError(true);
  };

  const confirm = e => {
    setLastConfirmation(true);
  };
  const cancel = e => {
    clean();
    disagreeFunction(e);
  };

  const localDisagreeFunction = last ? cancel : disagreeFunction;

  const localAgreeFunction = last ? confirm : agreeFunction;

  return (
    <Dialog open={open} onClose={localDisagreeFunction}>
      {!lastConfirmation && (
        <>
          <DialogTitle>{title}</DialogTitle>
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
          <DialogTitle>{D.confirmTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText>{D.confirmRandom}</DialogContentText>
            <Typography className={classes.randomText}>{randomText}</Typography>
            <TextField
              error={userInputError}
              helperText={userInputError ? D.confirmError : null}
              defaultValue=""
              placeholder={getRandomText()}
              id="name"
              value={userInput}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={validateInput} className={classes.agreeBtn}>
              {D.confirmButton}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};
