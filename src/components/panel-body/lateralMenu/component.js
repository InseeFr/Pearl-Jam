import { Card, Drawer } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Notification from './notificationItem';

const useStyles = makeStyles(theme => ({
  drawer: {
    top: '5em',
  },
  secondDrawerPaper: {
    left: '200px',
    minWidth: 'max-content',
    backgroundColor: theme.palette.primary.dark,
    top: '5em',
  },
  backDrop: {
    backgroundColor: 'transparent',
  },
  drawerPaper: {
    minWidth: 'max-content',
    top: '5em',
    backgroundColor: theme.palette.primary.darker,
  },
  card: {
    height: '5em',
    width: '200px',
    borderRadius: '0',
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '1em',
    color: 'white',
  },
  link: {
    textDecoration: 'unset',
  },
  clickable: { cursor: 'pointer' },
  title: { marginLeft: '1em' },
}));
const LateralMenu = ({ openDrawer, setOpenDrawer }) => {
  const classes = useStyles();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleClick = event => {
    if (event.target.id === 'notifications') {
      setShowNotifications(true);
      event.stopPropagation();
    }
  };

  return (
    <>
      <Drawer
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}
        BackdropProps={{
          classes: {
            root: classes.backDrop,
          },
        }}
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <NavLink exact to="/">
          <Card className={classes.card} onClick={() => setOpenDrawer(false)}>
            <Typography>Accueil</Typography>
          </Card>
        </NavLink>
        <NavLink exact to="/">
          <Card className={classes.card} onClick={() => setOpenDrawer(false)}>
            <Typography className={classes.link}>Suivi</Typography>
          </Card>
        </NavLink>

        <Card
          id="notifications"
          className={`${classes.card} ${classes.clickable}`}
          onClick={handleClick}
        >
          <Typography>Notifications</Typography>
          <ChevronRightIcon />
        </Card>
      </Drawer>
      <Drawer
        className={`${classes.drawer} ${classes.secondDrawer}`}
        BackdropProps={{
          classes: {
            root: classes.backDrop,
          },
        }}
        classes={{
          paper: classes.secondDrawerPaper,
        }}
        open={showNotifications}
        onClose={() => setShowNotifications(false)}
      >
        <Typography variant="h6" className={classes.title}>
          Notifications
        </Typography>
        <Notification />
        <Notification />
        <Notification />
      </Drawer>
    </>
  );
};

export default LateralMenu;
LateralMenu.propTypes = {
  openDrawer: PropTypes.bool.isRequired,
  setOpenDrawer: PropTypes.func.isRequired,
};
