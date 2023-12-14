import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import WifiIcon from '@material-ui/icons/Wifi';
import clsx from 'clsx';
import { AppContext } from 'Root';

const useStyles = makeStyles(theme => ({
  red: {
    color: theme.palette.error.main,
  },
  green: {
    color: '#019A3E',
  },
  icon: {
    fontSize: '24px',
    alignSelf: 'center',
    marginRight: "60px"
  },
}));

const OnlineStatus = () => {
  const { online } = useContext(AppContext);

  const { icon, green, red } = useStyles();

  return <WifiIcon className={clsx(icon, online ? green : red)} />;
};

export default OnlineStatus;
