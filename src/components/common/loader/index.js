import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import D from 'i18n';
import imgPreloader from 'img/loader.svg';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
  },
}));

const Preloader = ({ message }) => {
  const classes = useStyles();
  return (
    <Backdrop className={classes.backdrop} open>
      <img src={imgPreloader} alt="waiting..." />
      <h2>{D.pleaseWait}</h2>
      <h3>{message}</h3>
    </Backdrop>
  );
};

export default Preloader;
Preloader.propTypes = {
  message: PropTypes.string.isRequired,
};
