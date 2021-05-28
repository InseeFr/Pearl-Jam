import { makeStyles, Paper, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(theme => ({
  primaryMain: {
    backgroundColor: theme.palette.primary.main,
    height: '5em',
  },
  primaryDark: {
    backgroundColor: theme.palette.primary.dark,
    height: '5em',
  },
  primaryDarker: {
    backgroundColor: theme.palette.primary.darker,
    height: '5em',
  },
  primaryLight: {
    backgroundColor: theme.palette.primary.light,
    height: '5em',
  },
  secondaryMain: {
    backgroundColor: theme.palette.secondary.main,
    height: '5em',
  },
  secondaryDark: {
    backgroundColor: theme.palette.secondary.dark,
    height: '5em',
  },
  secondaryLight: {
    backgroundColor: theme.palette.secondary.light,
    height: '5em',
  },
  errorMain: {
    backgroundColor: theme.palette.error.main,
    height: '5em',
  },
  errorDark: {
    backgroundColor: theme.palette.error.dark,
    height: '5em',
  },
  errorLight: {
    backgroundColor: theme.palette.error.light,
    height: '5em',
  },
}));

const Palette = () => {
  const classes = useStyles();

  return (
    <>
      <Paper className={classes.primaryDarker}>
        <Typography color="textPrimary">Primary.darker text.primary</Typography>
        <Typography color="textSecondary">Primary.darker text.secondary</Typography>
      </Paper>
      <Paper className={classes.primaryDark}>
        <Typography color="textPrimary">Primary.dark text.primary</Typography>
        <Typography color="textSecondary">Primary.dark text.secondary</Typography>
      </Paper>
      <Paper className={classes.primaryMain}>
        <Typography color="textPrimary">Primary.main text.primary</Typography>
        <Typography color="textSecondary">Primary.main text.secondary</Typography>
      </Paper>
      <Paper className={classes.primaryLight}>
        <Typography color="textPrimary">Primary.light text.primary</Typography>
        <Typography color="textSecondary">Primary.light text.secondary</Typography>
      </Paper>
      <Paper className={classes.secondaryDark}>
        <Typography>Secondary.dark</Typography>
      </Paper>
      <Paper className={classes.secondaryMain}>
        <Typography>Secondary.main</Typography>
      </Paper>
      <Paper className={classes.secondaryLight}>
        <Typography>Secondary.light</Typography>
      </Paper>
      <Paper className={classes.errorDark}>
        <Typography>error.dark</Typography>
      </Paper>
      <Paper className={classes.errorMain}>
        <Typography>error.main</Typography>
      </Paper>
      <Paper className={classes.errorLight}>
        <Typography>error.light</Typography>
      </Paper>
    </>
  );
};

export default Palette;
