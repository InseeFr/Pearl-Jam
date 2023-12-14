import {
  getLastState,
  getprivilegedPerson,
  isSelectable,
} from 'utils/functions/surveyUnitFunctions';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import D from 'i18n';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import PersonIcon from '@material-ui/icons/Person';
import PropTypes from 'prop-types';
import RadioButtonUncheckedSharpIcon from '@material-ui/icons/RadioButtonUncheckedSharp';
import React from 'react';
import ScheduleIcon from '@material-ui/icons/Schedule';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import WarningIcon from '@material-ui/icons/Warning';
import { convertSUStateInToDo } from 'utils/functions/convertSUStateInToDo';
import { intervalInDays } from 'utils/functions';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';

const colorMapping = {
  1: '#FFC9D5',
  2: '#F8E4A5',
  3: '#E9C09C',
  4: '#B7A1C8',
  5: '#A5BCDB',
  6: '#9AE3AB',
};

const useStyles = makeStyles(theme => ({
  ...Object.keys(colorMapping).reduce((acc, order) => {
    acc[`todoColor${order}`] = {
      backgroundColor: colorMapping[order],
      borderRadius: '0.5em',
      padding: '0.05em 0.6em 0.05em 0.6em',
      margin: '0.2em',
      fontSize: '14px',
      color: '#0A192E',
    };
    return acc;
  }, {}),
  root: {
    padding: '24px',
    borderRadius: '16px',
    '&:hover': { cursor: 'pointer' },
    backgroundColor: '#FFFFFF',
    height: '236px',
    width: '306px',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  justifyStart: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
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
    verticalAlign: 'middle',
    color: '#57677D',
  },
  locationIcon: {
    verticalAlign: 'middle',
    color: '#0A192E',
    height: '16px',
    width: '16px',
  },
  personIcon: {
    verticalAlign: 'middle',
    color: '#0A192E',
    width: '24px',
    height: '24px',
  },
  scheduleIcon: {
    verticalAlign: 'middle',
    color: '#57677D',
    width: '16px',
    height: '16px',
  },
  inactive: {
    backgroundColor: 'grey',
    '&:hover': { cursor: 'not-allowed' },
  },
  paddingTop: {
    fontSize: '32px',
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
  marginRight: {
    margin: ' 4px 4px 4px 4px',
  },
  verticalIconContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  typo: {
    backgroundColor: '#E6EAF0',
    width: '150px',
    borderRadius: '3em',
    fontSize: '14px',
    textAlign: 'center',
    fontWeight: '600',
    color: '#0A192E',
  },
  cardContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  wrapperSchedule: {
    display: 'flex',
    alignItems: 'center',
  },
  textRight: {
    textAlign: 'right',
  },
}));

const SurveyUnitCard = ({ surveyUnit, inaccessible = false }) => {
  const classes = useStyles();

  const navigate = useNavigate();

  const active = isSelectable(surveyUnit);

  const {
    id,
    address: { l6 },
    campaign,
    sampleIdentifiers: { ssech },
    priority,
    persons,
  } = surveyUnit;
  const cityName = l6.replace(/^\d+\s/, '').trim();
  const privilegedPerson = getprivilegedPerson(surveyUnit);
  const { firstName, lastName } = privilegedPerson ?? persons[0];
  const lastState = getLastState(surveyUnit);
  const todo = convertSUStateInToDo(lastState.type);
  const { order, value: toDoLabel } = todo;
  const nbJoursRestant = intervalInDays(surveyUnit);
  const openSurveyUnitPage = id => navigate(`/survey-unit/${id}/details?panel=0`);

  return (
    <Card
      className={`${classes.root} ${classes.flexColumn} ${active ? '' : classes.inactive}`}
      onClick={() => (active ? openSurveyUnitPage(id) : {})}
      elevation={0}
    >
      <CardContent className={` ${classes.flexRow}`}>
        <Typography className={classes.typo} component="h6" variant="h6" noWrap>
          {campaign.toLowerCase()}
        </Typography>
      </CardContent>
      <CardContent className={`${classes.content} ${classes.verticalIconContainer}`}>
        <div className={classes.justifyStart}>
          <PersonIcon className={classes.personIcon} />
          <div className={`${classes.flexRow} ${classes.alignItemsCenter}`}>
            <Typography
              component="h6"
              variant="subtitle1"
              noWrap
              className={`${classes.maxWidth} ${classes.marginRight}`}
            >
              {firstName}
            </Typography>
            <Typography
              component="h6"
              variant="subtitle1"
              noWrap
              className={`${classes.maxWidth} ${classes.marginRight}`}
            >
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

      <CardContent className={`${classes.content} ${classes.verticalIconContainer}`}>
        <Typography variant="subtitle1" color="textSecondary" noWrap className={classes.maxWidth}>
          <LocationOnIcon className={classes.locationIcon} />
          {cityName}
        </Typography>
        <Typography
          variant="subtitle1"
          color="textSecondary"
          className={classes.flexRow}
        ></Typography>
      </CardContent>
      <CardContent className={`${classes.content} ${classes.verticalIconContainer}`}>
        <div className={classes.cardContent}>
          <div className={classes.wrapperSchedule}>
            <ScheduleIcon className={classes.scheduleIcon} />
            <Typography className={classes.leftMargin} variant="subtitle1" color="textSecondary">
              {`${nbJoursRestant} jours`}
            </Typography>
          </div>
          <Typography
            className={`${classes.leftMargin} ${classes.textRight} ${classes[`todoColor${order}`]}`}
          >
            {toDoLabel}
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
