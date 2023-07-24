import { NavLink, Route } from 'react-router-dom';
import React, { useContext, useMemo, useState } from 'react';

import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import AppBar from '@material-ui/core/AppBar';
import Badge from '@material-ui/core/Badge';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import D from 'i18n';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { NotificationWrapperContext } from 'components/notificationWrapper';
import Notifications from '@material-ui/icons/Notifications';
import { NotificationsRoot } from 'components/common/Notification/notificationsRoot';
import OnlineStatus from 'components/common/online-status';
import { PEARL_USER_KEY } from 'utils/constants';
import Popper from '@material-ui/core/Popper';
import PropTypes from 'prop-types';
import SearchBar from '../search/component';
import Synchronize from 'components/common/synchronize';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { UserContext } from 'components/panel-body/home/UserContext';
import { makeStyles } from '@material-ui/core/styles';
import { Modal } from '@material-ui/core';
import { UserProfile } from 'components/common/userProfile';

export const NavigationContext = React.createContext();

const Navigation = ({ textSearch, setTextSearch, setOpenDrawer }) => {
  const { unReadNotificationsNumber } = useContext(NotificationWrapperContext);
  const user = useContext(UserContext);

  const useStyles = makeStyles(theme => ({
    appBar: {
      backgroundColor: theme.palette.primary.main,
      height: '5em',
    },
    column: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'end',
    },
    card: {
      borderRadius: 0,
    },
    media: {
      height: '3em',
      width: '3em',
    },
    grow: {
      flex: '1 1 auto',
    },
    notificationsIcon: {
      fontSize: 'xx-large',
      color: theme.palette.secondary.main,
      '&:hover': { color: theme.palette.secondary.dark },
    },
    syncIcon: {
      fontSize: 'xxx-large',
      color: theme.palette.secondary.main,
      alignSelf: 'center',
    },
    noVisibleFocus: {
      '&:focus, &:hover': {
        backgroundColor: theme.palette.primary.main,
      },
      marginLeft: '1em',
      marginRight: '1em',
    },
    notif: {
      zIndex: 1200,
    },
    profileModal: {
      paddingTop: '5em',
      display: 'flex',
      justifyContent: 'flex-end',
      margin: '1em',
    },
  }));

  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleClickAway = () => {
    setOpen(false);
  };

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
    setOpen(o => !o);
  };

  const clickOnProfile = () => {
    setProfileOpen(o => !o);
  };
  const contextValue = useMemo(() => ({ setOpen }), [setOpen]);

  return (
    <NavigationContext.Provider value={contextValue}>
      <AppBar position="sticky" className={classes.appBar} elevation={0}>
        <Toolbar className={classes.appBar}>
          <NavLink activeClassName="active" exact to="/">
            <Card className={classes.card}>
              <CardMedia
                className={classes.media}
                image="/static/images/logo-insee-header.png"
                title="Insee"
              />
            </Card>
          </NavLink>
          <Tooltip title={D.goToHomePage}>
            <IconButton
              className={classes.noVisibleFocus}
              edge="end"
              color="inherit"
              aria-label="open notifications"
              onClick={() => setOpenDrawer(true)}
            >
              <MenuIcon className={classes.notificationsIcon} />
            </IconButton>
          </Tooltip>
          <Typography variant="h4">Sabiane</Typography>
          <Typography variant="h4" color="error">
            Collecte
          </Typography>

          <div className={classes.grow}>
            <Route
              exact
              path="/"
              render={routeProps => (
                <SearchBar {...routeProps} textSearch={textSearch} setTextSearch={setTextSearch} />
              )}
            />
          </div>
          <div className={classes.column}>
            <ClickAwayListener onClickAway={handleClickAway}>
              <div>
                <Tooltip title={D.notifications}>
                  <IconButton onClick={handleClick}>
                    <Badge badgeContent={unReadNotificationsNumber} color="secondary">
                      <Notifications />
                    </Badge>
                  </IconButton>
                </Tooltip>
                <Popper
                  className={classes.notif}
                  open={open}
                  anchorEl={anchorEl}
                  placement="bottom"
                  transition
                >
                  {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={0}>
                      <NotificationsRoot />
                    </Fade>
                  )}
                </Popper>
              </div>
            </ClickAwayListener>
          </div>
          <OnlineStatus />
          <Synchronize materialClass={classes.syncIcon} />
          <IconButton
            className={classes.noVisibleFocus}
            edge="end"
            color="inherit"
            aria-label="open profile"
            onClick={clickOnProfile}
          >
            <AssignmentIndIcon className={classes.syncIcon} />
          </IconButton>
          <Modal open={profileOpen} onClose={clickOnProfile} className={classes.profileModal}>
            <UserProfile user={user} />
          </Modal>
        </Toolbar>
      </AppBar>
    </NavigationContext.Provider>
  );
};
export default Navigation;
Navigation.propTypes = {
  textSearch: PropTypes.string.isRequired,
  setTextSearch: PropTypes.func.isRequired,
  setOpenDrawer: PropTypes.func.isRequired,
};
