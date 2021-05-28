import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';

const useStyles = makeStyles(() => ({
  root: {
    padding: 8,
    height: '5em',
    margin: '0.5em',
  },
}));

const NotificationItem = () => {
  const classes = useStyles();

  return (
    <Card className={classes.root} elevation={0}>
      <Typography variant="h6">Synchronisation réussie</Typography>
      <Typography>09:15</Typography>
    </Card>
  );
};

export default NotificationItem;
