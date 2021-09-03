import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import WarningIcon from '@material-ui/icons/Warning';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import PersonIcon from '@material-ui/icons/Person';
import RadioButtonUncheckedSharpIcon from '@material-ui/icons/RadioButtonUncheckedSharp';
import ScheduleIcon from '@material-ui/icons/Schedule';
import { intervalInDays } from 'utils/functions';
import { convertSUStateInToDo } from 'utils/functions/convertSUStateInToDo';
import {
  getLastState,
  getprivilegedPerson,
  isSelectable,
} from 'utils/functions/surveyUnitFunctions';
import PropTypes from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Tooltip } from '@material-ui/core';
import D from 'i18n';

const useStyles = makeStyles(theme => ({
  root: {
    padding: 8,
    borderRadius: 15,
    '&:hover': { cursor: 'pointer' },
    border: ' LightGray solid 1px',
    height: 165,
    width: 325,
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  justifyStart: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
    padding: 0,
    '&:last-child': {
      paddingBottom: 0,
    },
  },

  icon: {
    verticalAlign: 'bottom',
    color: 'LightGray',
  },
  inactive: {
    backgroundColor: 'grey',
    '&:hover': { cursor: 'not-allowed' },
  },
  paddingTop: {
    paddingTop: '10px',
    fontSize: 'xxx-large',
  },
  stateIcon: {
    color: 'green',
    verticalAlign: 'center',
  },
  rounded: {
    border: '1px solid',
    borderRadius: '50%',
    width: '1.8em',
    height: '1.8em',
  },
  negativeLeftMargin: { marginLeft: '-5px' },
  hidden: { visibility: 'hidden' },
  maxWidth: {
    maxWidth: '180px',
  },
  leftMargin: {
    marginLeft: '2px',
  },
  warning: { color: theme.palette.warning.main },
}));

const SurveyUnitCard = ({ surveyUnit, inaccessible = false }) => {
  const classes = useStyles();

  const history = useHistory();

  const active = isSelectable(surveyUnit);

  const {
    id,
    address: { l6 },
    campaign,
    sampleIdentifiers: { ssech },
    priority,
    persons,
  } = surveyUnit;

  const privilegedPerson = getprivilegedPerson(surveyUnit);
  // persons.find(p => p.privileged);
  const { firstName, lastName } = privilegedPerson ? privilegedPerson : persons[0];
  const lastState = getLastState(surveyUnit);
  const todo = convertSUStateInToDo(lastState.type);
  const { order, value: toDoLabel } = todo;
  const nbJoursRestant = intervalInDays(surveyUnit);

  return (
    <Card
      className={`${classes.root} ${classes.flexColumn} ${active ? '' : classes.inactive}`}
      onClick={() => (active ? history.push(`/survey-unit/${id}/details`) : {})}
      elevation={0}
    >
      <CardContent className={`${classes.content} ${classes.flexRow}`}>
        <Typography component="h5" variant="h5" className={`${priority ? '' : classes.hidden}`}>
          !
        </Typography>
        <Typography component="h6" variant="h6" noWrap>
          {campaign.toLowerCase()}
        </Typography>
        <Typography
          variant="subtitle1"
          color="textSecondary"
          align="center"
          className={classes.rounded}
        >
          {ssech}
        </Typography>
      </CardContent>
      <CardContent className={`${classes.content} ${classes.flexRow} `}>
        <div className={classes.justifyStart}>
          <PersonIcon className={`${classes.icon} ${classes.paddingTop}`} />
          <div className={classes.flexColumn}>
            <Typography component="h6" variant="h6" noWrap className={classes.maxWidth}>
              {firstName}
            </Typography>
            <Typography component="h6" variant="h6" noWrap className={classes.maxWidth}>
              {lastName}
            </Typography>
          </div>
        </div>
        {inaccessible && (
          <Tooltip title={D.questionnaireInaccessible}>
            <WarningIcon className={classes.warning} />
          </Tooltip>
        )}
      </CardContent>
      <CardContent className={`${classes.content} ${classes.flexRow}`}>
        <Typography variant="subtitle1" color="textSecondary" noWrap className={classes.maxWidth}>
          <LocationOnIcon className={`${classes.icon} ${classes.negativeLeftMargin}`} />
          {`${l6}`}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" className={classes.flexRow}>
          {order !== 7 ? (
            <RadioButtonUncheckedSharpIcon className={`${classes.icon} ${classes.stateIcon}`} />
          ) : (
            <CheckCircleOutlineIcon className={`${classes.icon} ${classes.stateIcon}`} />
          )}
          <Typography className={classes.leftMargin}>{toDoLabel}</Typography>
        </Typography>
      </CardContent>
      <CardContent className={`${classes.content} ${classes.flexRow}`}>
        <Typography variant="subtitle1" color="textSecondary">
          {` # ${id}`}
        </Typography>
        <div className={classes.flexRow}>
          <ScheduleIcon className={classes.icon} />
          <Typography className={classes.leftMargin} variant="subtitle1" color="textSecondary">
            {`${nbJoursRestant} jours`}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

export default SurveyUnitCard;
SurveyUnitCard.propTypes = {
  surveyUnit: PropTypes.shape({
    id: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    address: PropTypes.shape({ l6: PropTypes.string.isRequired }).isRequired,
    campaign: PropTypes.string.isRequired,
    states: PropTypes.arrayOf(PropTypes.shape({ type: PropTypes.string.isRequired })).isRequired,
    sampleIdentifiers: PropTypes.shape({ ssech: PropTypes.number.isRequired }).isRequired,
    priority: PropTypes.bool.isRequired,
  }).isRequired,
};
