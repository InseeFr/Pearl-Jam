import Card from '@material-ui/core/Card';
import D from 'i18n';
import Drawer from '@material-ui/core/Drawer';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  backDrop: {
    backgroundColor: 'transparent',
  },
  drawerPaper: {
    minWidth: 'max-content',
    top: '5em',
  },
  card: {
    minHeight: '5em',
    width: '200px',
    borderRadius: '0',
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    padding: '1em',
  },
  link: {
    textDecoration: 'unset',
  },
}));

const LateralMenu = ({ openDrawer, setOpenDrawer, version }) => {
  const classes = useStyles();

  return (
    <Drawer
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
      <NavLink exact to="/" className={classes.link}>
        <Card className={classes.card} onClick={() => setOpenDrawer(false)}>
          <Typography>{D.goToHomePage}</Typography>
        </Card>
      </NavLink>
      <NavLink exact to="/" className={classes.link}>
        <Card className={classes.card} onClick={() => setOpenDrawer(false)}>
          <Typography>Suivi</Typography>
        </Card>
      </NavLink>

      <Card className={classes.card}>
        <Typography>{`Version : ${version}`}</Typography>
      </Card>
    </Drawer>
  );
};

export default LateralMenu;
LateralMenu.propTypes = {
  openDrawer: PropTypes.bool.isRequired,
  setOpenDrawer: PropTypes.func.isRequired,
  version: PropTypes.string.isRequired,
};
