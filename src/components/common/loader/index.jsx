import Backdrop from '@mui/material/Backdrop';
import D from 'i18n';
import imgPreloader from 'img/loader.svg';
import PropTypes from 'prop-types';
import React from 'react';
import { theme } from '../../../ui/PearlTheme';

const Preloader = ({ message }) => {
  return (
    <Backdrop
      open
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
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
