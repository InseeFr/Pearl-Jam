import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import AssignmentIcon from '@material-ui/icons/Assignment';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import BugReportIcon from '@material-ui/icons/BugReport';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import CommentIcon from '@material-ui/icons/Comment';
import DeleteIcon from '@material-ui/icons/Delete';
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';
import PhoneIcon from '@material-ui/icons/Phone';
import PropTypes from 'prop-types';
import RemoveIcon from '@material-ui/icons/Remove';
import SearchIcon from '@material-ui/icons/Search';
import StarIcon from '@material-ui/icons/Star';
import SyncIcon from './SyncIcon';
import Warning from '@material-ui/icons/Warning';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  infoIcon: {
    fontSize: 'xx-large',
    color: 'gray',
    alignSelf: 'center',
  },
  star: { color: 'gold', alignSelf: 'center' },
  green: { color: theme.palette.success.main },
  grey: { color: 'lightgrey' },

  red: { color: 'red' },
  clickable: {
    '&:hover': { cursor: 'pointer', color: 'red', transition: '0.25s' },
    '&:not(:hover)': { transition: '0.25s' },
    fontSize: 'x-large',
  },
  success: {
    color: theme.palette.success.main,
  },
  failure: {
    color: theme.palette.error.main,
  },
  warning: {
    color: theme.palette.warning.main,
  },
  minus: {
    color: theme.palette.primary.darker,
  },
  syncIcon: {
    fontSize: 'xxx-large',
    color: theme.palette.secondary.main,
    alignSelf: 'center',
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
    starFull: <StarIcon className={classes.red} onClick={onClick}></StarIcon>,
    starOutlined: <StarIcon className={classes.grey} onClick={onClick}></StarIcon>,
    delete: (
      <DeleteIcon className={mixClasses(classes.infoIcon, classes.clickable)} onClick={onClick} />
    ),
    googles: <SearchIcon className={mixClasses(classes.infoIcon, classes.red)} />,
    checked: <CheckIcon className={classes.green} />,
    cross: <ClearIcon className={classes.red} />,
    error: <ClearIcon className={classes.failure} fontSize="large" />,
    success: <CheckCircleOutline className={classes.success} fontSize="large" />,
    assignement: <CommentIcon className={mixClasses(classes.infoIcon, classes.red)} />,
    questionnaire: <AssignmentIcon className={mixClasses(classes.infoIcon, classes.red)} />,
    assignementChecked: <AssignmentTurnedInIcon className={classes.infoIcon} />,
    pen: (
      <BorderColorIcon
        className={mixClasses(classes.infoIcon, classes.clickable)}
        onClick={onClick}
      />
    ),
    bug: <BugReportIcon className={classes.infoIcon} />,
    warning: <Warning className={classes.warning} fontSize="large" />,
    remove: <RemoveIcon className={classes.minus} fontSize="large" />,
    sync: <SyncIcon className={classes.syncIcon} />,
  };

  return icons[type];
};

export const icons = { USER: 'user', HOME: 'home', EDITION: 'pen', GOOGLES: 'googles' };

export default MaterialIcons;
MaterialIcons.propTypes = {
  type: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};
