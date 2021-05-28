import { makeStyles } from '@material-ui/core';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import DeleteIcon from '@material-ui/icons/Delete';
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';
import PhoneIcon from '@material-ui/icons/Phone';
import StarIcon from '@material-ui/icons/Star';
import StarOutlineIcon from '@material-ui/icons/StarOutline';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles(() => ({
  infoIcon: {
    fontSize: 'xx-large',
    color: 'gray',
    marginTop: '-8px',
    alignSelf: 'center',
  },
  star: { color: 'gold', alignSelf: 'center' },
}));

const MaterialIcons = ({ type, onClick = () => {} }) => {
  const classes = useStyles();

  const icons = {
    user: <PersonIcon className={classes.infoIcon} />,
    home: <HomeIcon className={classes.infoIcon} />,
    mail: <AlternateEmailIcon className={classes.infoIcon} />,
    phone: <PhoneIcon className={classes.infoIcon} />,
    starFull: <StarIcon className={classes.star} onClick={onClick}></StarIcon>,
    starOutlined: <StarOutlineIcon className={classes.star} onClick={onClick}></StarOutlineIcon>,
    delete: <DeleteIcon className={classes.infoIcon} onClick={onClick} />,
  };

  return icons[type];
};
export default MaterialIcons;
MaterialIcons.propTypes = {
  type: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};
