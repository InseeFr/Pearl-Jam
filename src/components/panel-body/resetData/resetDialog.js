/* eslint-disable jsx-a11y/no-autofocus */
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
import { PEARL_USER_KEY } from 'utils/constants';

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
  confirm2: { marginTop: '2em' },
}));

export const ResetDialog = ({
  open,
  title,
  body,
  agree,
  disagree,
  agreeFunction,
  disagreeFunction,
}) => {
  const classes = useStyles();

  const getRandomText = () =>
    Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase();

  const [step, setStep] = useState(null);

  const [randomText, setRandomText] = useState(() => getRandomText());
  const [placeHolder] = useState(() => getRandomText());
  const [values, setValues] = useState({ user: null, random: null });
  const [errors, setErrors] = useState({ user: false, random: false });

  const clean = () => {
    setStep(null);
    setValues({ user: null, random: null });
    setErrors({ user: false, random: false });
    setRandomText(getRandomText());
  };

  const handleChange = event => {
    const {
      target: { id, value },
    } = event;
    setValues({ ...values, [id]: value });
    setErrors({ ...errors, [id]: false });
  };

  const validateInput = e => {
    e.preventDefault();
    if (step === 'random') {
      if (randomText === values.random) {
        setStep('user');
      } else setErrors({ ...errors, random: true });
    } else if (step === 'user') {
      const { id } = JSON.parse(window.localStorage.getItem(PEARL_USER_KEY) || '{}');
      if ((id || '').toLowerCase() === values.user.toLowerCase()) {
        clean();
        agreeFunction();
      } else setErrors({ ...errors, user: true });
    }
  };

  const confirm = e => {
    setStep('random');
  };
  const cancel = e => {
    disagreeFunction(e);
    clean();
  };

  return (
    <Dialog open={open} onClose={cancel}>
      {!step && (
        <>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            <DialogContentText>{body}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={confirm} className={classes.agreeBtn}>
              {agree}
            </Button>
            <Button onClick={cancel} className={classes.disagreeBtn}>
              {disagree}
            </Button>
          </DialogActions>
        </>
      )}
      {step && (
        <>
          <DialogTitle>{D.confirmTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {step === 'random' ? D.confirmRandom : D.confirmId}
            </DialogContentText>
            <form onSubmit={validateInput}>
              {step === 'random' && (
                <>
                  <Typography className={classes.randomText}>{randomText}</Typography>
                  <TextField
                    autoFocus
                    error={errors.random}
                    helperText={errors.random ? D.confirmError : null}
                    defaultValue=""
                    placeholder={placeHolder}
                    id={'random'}
                    value={values.random}
                    onChange={handleChange}
                  />
                </>
              )}
              {step === 'user' && (
                <TextField
                  autoFocus
                  error={errors.user}
                  helperText={errors.user ? D.confirmErrorUser : null}
                  defaultValue=""
                  placeholder={placeHolder}
                  id={'user'}
                  value={values.user}
                  onChange={handleChange}
                />
              )}
            </form>
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
