import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import AssignmentIcon from '@material-ui/icons/Assignment';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import BugReportIcon from '@material-ui/icons/BugReport';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import CommentIcon from '@material-ui/icons/Comment';
import DeleteIcon from '@material-ui/icons/Delete';
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';
import PhoneIcon from '@material-ui/icons/Phone';
import PropTypes from 'prop-types';
import React from 'react';
import SearchIcon from '@material-ui/icons/Search';
import StarIcon from '@material-ui/icons/Star';
import StarOutlineIcon from '@material-ui/icons/StarOutline';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  infoIcon: {
    fontSize: 'xx-large',
    color: 'gray',
    marginTop: '-8px',
    alignSelf: 'center',
  },
  star: { color: 'gold', alignSelf: 'center' },
  green: { color: 'green' },

  red: { color: 'red' },
  clickable: {
    '&:hover': { cursor: 'pointer', color: 'red' },
  },
}));

const MaterialIcons = ({ type, onClick = () => {} }) => {
  const classes = useStyles();
  const mixClasses = (class1, class2) => `${class1} ${class2}`;

  const icons = {
    user: <PersonIcon className={mixClasses(classes.infoIcon, classes.red)} />,
    home: <HomeIcon className={mixClasses(classes.infoIcon, classes.red)} />,
    mail: <AlternateEmailIcon className={classes.infoIcon} />,
    phone: <PhoneIcon className={classes.infoIcon} />,
    starFull: <StarIcon className={classes.star} onClick={onClick}></StarIcon>,
    starOutlined: <StarOutlineIcon className={classes.star} onClick={onClick}></StarOutlineIcon>,
    delete: <DeleteIcon className={classes.infoIcon} onClick={onClick} />,
    googles: <SearchIcon className={mixClasses(classes.infoIcon, classes.red)} />,
    checked: <CheckIcon className={classes.green} />,
    cross: <ClearIcon className={classes.red} />,
    assignement: <CommentIcon className={mixClasses(classes.infoIcon, classes.red)} />,
    questionnaire: <AssignmentIcon className={mixClasses(classes.infoIcon, classes.red)} />,
    assignementChecked: <AssignmentTurnedInIcon className={classes.infoIcon} />,
    pen: (
      <BorderColorIcon className={`${classes.infoIcon} ${classes.clickable}`} onClick={onClick} />
    ),
    bug: <BugReportIcon className={classes.infoIcon} />,
  };

  return icons[type];
};

export const icons = { USER: 'user', HOME: 'home', EDITION: 'pen', GOOGLES: 'googles' };

export default MaterialIcons;
MaterialIcons.propTypes = {
  type: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};
