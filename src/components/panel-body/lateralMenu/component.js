import { Card, Drawer } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import D from 'i18n';
import PropTypes from 'prop-types';
import React from 'react';
import { NavLink } from 'react-router-dom';

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
const LateralMenu = ({ openDrawer, setOpenDrawer, version }) => {
  const classes = useStyles();

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
            <Typography>{D.goToHomePage}</Typography>
          </Card>
        </NavLink>
        <NavLink exact to="/">
          <Card className={classes.card} onClick={() => setOpenDrawer(false)}>
            <Typography className={classes.link}>Suivi</Typography>
          </Card>
        </NavLink>

        <Card className={classes.card}>
          <Typography>{`Version : ${version}`}</Typography>
        </Card>
      </Drawer>
    </>
  );
};

export default LateralMenu;
LateralMenu.propTypes = {
  openDrawer: PropTypes.bool.isRequired,
  setOpenDrawer: PropTypes.func.isRequired,
  version: PropTypes.string.isRequired,
};
