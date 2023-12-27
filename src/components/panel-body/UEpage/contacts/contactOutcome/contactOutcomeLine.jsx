import MaterialIcons from 'utils/icons/materialIcons';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { findContactOutcomeValueByType } from 'utils/enum/ContactOutcomeEnum';
import { getDateAttributes } from 'utils/functions/date';
import { grey } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    borderRadius: '15px',
    backgroundColor: grey[100],
    padding: '0.5em',
    justifyContent: 'space-between',
  },
  overflow: {
    maxWidth: '30em',
  },
}));

const ContactOutcomeLine = ({ contactOutcome }) => {
  const classes = useStyles();
  if (contactOutcome?.type === undefined) return '';

  const { dayOfWeek, twoDigitdayNumber, month } = getDateAttributes(contactOutcome.date);

  const upcasedDayOfWeek = dayOfWeek[0].toUpperCase() + dayOfWeek.slice(1);
  const date = `${twoDigitdayNumber} ${month}`;

  return (
    <Paper className={classes.root} key={contactOutcome.date} elevation={0}>
      <Typography className={classes.overflow}>
        {`${upcasedDayOfWeek} ${date} - ${findContactOutcomeValueByType(contactOutcome.type)}`}
      </Typography>
      <MaterialIcons type="checked" />
    </Paper>
  );
};

export default ContactOutcomeLine;
ContactOutcomeLine.propTypes = {
  deleteParams: PropTypes.shape({
    deleteFunction: PropTypes.func.isRequired,
    deleteIsAvailable: PropTypes.bool.isRequired,
  }),
  contactAttempt: PropTypes.shape({
    date: PropTypes.number.isRequired,
    id: PropTypes.number,
    status: PropTypes.string.isRequired,
  }),
  selected: PropTypes.bool,
};
