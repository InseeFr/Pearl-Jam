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
import ListOutlinedIcon from '@material-ui/icons/ListOutlined';
import NotificationsActiveOutlinedIcon from '@material-ui/icons/NotificationsActiveOutlined';
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
import { version } from '../../../../package.json';

export const NavigationContext = React.createContext();

const Navigation = ({ textSearch, setTextSearch, setOpenDrawer }) => {
  const { unReadNotificationsNumber } = useContext(NotificationWrapperContext);
  const user = useContext(UserContext);

  const useStyles = makeStyles(theme => ({
    appBar: {
      backgroundColor: theme.palette.primary.main,
      height: '83px',
      paddingRight: '32px',
      paddingLeft: '32px',
    },
    column: {
      display: 'flex',
      width: '800px',
      justifyContent: 'flex-end',
    },
    card: {
      marginRight: '40px',
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
      fontSize: '24px',
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
    profileModal: {
      paddingTop: '5em',
      display: 'flex',
      justifyContent: 'flex-end',
      margin: '1em',
    },
    rightMargin: {
      marginRight: '60px',
    },
    leftMargin: {
      marginLeft: '1em',
    },
    containerAppBar: {
      display: 'flex',
      width: '100vw',
      justifyContent: 'space-between',
    },
    navLinkContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    logoWrapper: {
      display: 'flex',
      flexDirection: 'column',
      marginLeft: '0.5em',
    },
    typoLogo: {
      display: 'flex',
    },
    typoMarginRight: {
      marginRight: '0.2em',
    },
    badgeMargin: {
      margin: '0 0 15px 15px',
    },
    marginProfile: {
      marginRight: '40px',
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
          <div className={classes.containerAppBar}>
            <div className={classes.navLinkContainer}>
              <NavLink activeClassName="active" exact to="/">
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.media}
                    image="/static/images/logo-insee-header.png"
                    title="Insee"
                  />
                </Card>
              </NavLink>
              <div className={classes.logoWrapper}>
                <div className={classes.typoLogo}>
                  <Typography variant="h5" className={classes.typoMarginRight}>
                    Sabiane
                  </Typography>
                  <Typography variant="h5" color="error">
                    Collecte
                  </Typography>
                </div>
                <Typography variant="subtitle2">{`V.${version}`}</Typography>
              </div>
            </div>
            <div className={classes.column}>
              <div>
                <Tooltip title={'Mon suivi'}>
                  <IconButton className={classes.rightMargin}>
                    <ListOutlinedIcon className={classes.syncIcon} />
                    <Typography variant="subtitle2" className={classes.leftMargin}>
                      Mon suivi
                    </Typography>
                  </IconButton>
                </Tooltip>
              </div>
              <ClickAwayListener onClickAway={handleClickAway}>
                <div>
                  <Tooltip title={D.notifications}>
                    <IconButton className={classes.rightMargin} onClick={handleClick}>
                      <NotificationsActiveOutlinedIcon className={classes.syncIcon} />
                      <Typography variant="subtitle2" className={classes.leftMargin}>
                        Mes notifications
                      </Typography>
                      <Badge
                        className={classes.badgeMargin}
                        badgeContent={unReadNotificationsNumber}
                        color="error"
                      ></Badge>
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
              <Synchronize className={classes.syncIcon} />
              <OnlineStatus />
              <IconButton
                className={classes.noVisibleFocus}
                edge="end"
                color="inherit"
                aria-label="open profile"
                onClick={clickOnProfile}
              >
                <AssignmentIndIcon className={classes.syncIcon} />
              </IconButton>
            </div>
          </div>
          <Modal open={profileOpen} onClose={clickOnProfile} className={classes.profileModal}>
            <UserProfile className={classes.marginProfile} user={user} />
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
