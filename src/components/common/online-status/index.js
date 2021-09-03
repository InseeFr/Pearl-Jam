import { makeStyles } from '@material-ui/core/styles';
import WifiIcon from '@material-ui/icons/Wifi';
import clsx from 'clsx';
import React, { useContext } from 'react';
import { AppContext } from 'Root';

const useStyles = makeStyles(theme => ({
  red: {
    color: theme.palette.error.main,
  },
  green: {
    color: 'green',
  },
  icon: {
    transform: 'rotate(45deg)',
    fontSize: 'xxx-large',
    marginBottom: '-10px',
    alignSelf: 'center',
  },
}));

const OnlineStatus = () => {
  const { online } = useContext(AppContext);

  const { icon, green, red } = useStyles();

  return <WifiIcon className={clsx(icon, online ? green : red)} />;
};

export default OnlineStatus;
