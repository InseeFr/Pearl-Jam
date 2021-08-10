import {
  Badge,
  Card,
  CardMedia,
  ClickAwayListener,
  Fade,
  IconButton,
  Popper,
  Tooltip,
} from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import { PEARL_USER_KEY } from 'utils/constants';
import Synchronize from 'components/common/synchronize';
import InfoTile from 'components/panel-body/UEpage/infoTile';
import D from 'i18n';
import PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import { NavLink, Route } from 'react-router-dom';
import OnlineStatus from '../online-status';
import SearchBar from '../search/component';
import { Notifications } from '@material-ui/icons';
import { NotificationsRoot } from '../Notification/notificationsRoot';
import { NotificationWrapperContext } from 'components/notificationWrapper';

export const NavigationContext = React.createContext();

const Navigation = ({ location, textSearch, setTextSearch, setOpenDrawer, refresh }) => {
  const { unReadNotificationsNumber } = useContext(NotificationWrapperContext);
  const [disabled, setDisable] = useState(location.pathname.startsWith('/queen'));

  useEffect(() => {
    setDisable(location.pathname.startsWith('/queen'));
  }, [location]);

  const getName = () => {
    const interviewerFromLocalStorage = window.localStorage.getItem(PEARL_USER_KEY);
    return interviewerFromLocalStorage
      ? `${JSON.parse(interviewerFromLocalStorage).firstName} ${
          JSON.parse(interviewerFromLocalStorage).lastName
        }`
      : '';
  };

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
      fontSize: 'xxx-large',
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
    },
    notif: {
      zIndex: 1200,
    },
  }));

  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  const handleClickAway = () => {
    setOpen(false);
  };
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
    setOpen(o => !o);
  };

  const context = { setOpen };

  return (
    <NavigationContext.Provider value={context}>
      <AppBar position="sticky" className={classes.appBar} elevation={0}>
        <Toolbar className={classes.appBar}>
          <Tooltip title={D.goToHomePage}>
            <IconButton
              className={classes.noVisibleFocus}
              edge="start"
              color="inherit"
              aria-label="open notifications"
            >
              <MenuIcon className={classes.notificationsIcon} onClick={() => setOpenDrawer(true)} />
            </IconButton>
          </Tooltip>
          <NavLink activeClassName="active" exact to="/">
            <Card className={classes.card}>
              <CardMedia
                className={classes.media}
                image="/static/images/logo-insee-header.png"
                title="Insee"
              />
            </Card>
          </NavLink>
          <div className={classes.grow}>
            <Route
              exact
              path="/"
              render={routeProps => (
                <SearchBar {...routeProps} textSearch={textSearch} setTextSearch={setTextSearch} />
              )}
            />
            <Route
              path="/survey-unit/:id"
              render={routeProps => <InfoTile {...routeProps} refresh={refresh} />}
            />
          </div>
          <div className={classes.column}>
            <ClickAwayListener onClickAway={handleClickAway}>
              <div>
                <IconButton onClick={handleClick}>
                  <Badge badgeContent={unReadNotificationsNumber} color="secondary">
                    <Notifications />
                  </Badge>
                </IconButton>
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
          <div className={classes.column}>
            <OnlineStatus />
            <Typography variant="subtitle1" noWrap>
              {getName()}
            </Typography>
          </div>
          <Synchronize disabled={disabled} materialClass={classes.syncIcon} />
        </Toolbar>
      </AppBar>
    </NavigationContext.Provider>
  );
};
export default Navigation;
Navigation.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  textSearch: PropTypes.string.isRequired,
  setTextSearch: PropTypes.func.isRequired,

  setOpenDrawer: PropTypes.func.isRequired,
  refresh: PropTypes.bool.isRequired,
};
