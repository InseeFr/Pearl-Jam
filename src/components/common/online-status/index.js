import { makeStyles } from '@material-ui/core/styles';
import WifiIcon from '@material-ui/icons/Wifi';
import clsx from 'clsx';
import { addOnlineStatusObserver } from 'utils';
import React, { useEffect, useState } from 'react';

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
  const [init, setInit] = useState(false);
  const [status, setStatus] = useState(navigator.onLine);
  useEffect(() => {
    if (!init) {
      addOnlineStatusObserver(s => {
        setStatus(s);
      });
      setInit(true);
    }
  }, [init]);

  const { icon, green, red } = useStyles();

  return <WifiIcon className={clsx(icon, status ? green : red)} />;
};

export default OnlineStatus;
