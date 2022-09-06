import D from 'i18n';
import MaterialIcons from 'utils/icons/materialIcons';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { findContactAttemptValueByType } from 'utils/enum/ContactAttemptEnum';
import { findMediumValueByType } from 'utils/enum/MediumEnum';
import { getDateAttributes } from 'utils/functions/dateFunctions';
import { grey } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  alignEnd: {
    alignSelf: 'flex-end',
  },
  root: {
    display: 'flex',
    height: 'max-content',
    justifyContent: 'space-between',
    borderRadius: '15px',
    backgroundColor: grey[100],
    padding: '0.5em',
    '&:not(:last-child)': { marginBottom: '1em' },
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  fullWidth: {
    grow: '1',
  },
}));

const ContactAttemptLine = ({ contactAttempt, deleteFunction }) => {
  const classes = useStyles();
  if (contactAttempt === undefined) return '';
  const { dayOfWeek, twoDigitdayNumber, month, hour, minutes } = getDateAttributes(
    contactAttempt.date
  );

  const upcasedDayOfWeek = dayOfWeek[0].toUpperCase() + dayOfWeek.slice(1);
  const date = `${twoDigitdayNumber} ${month}`;

  return (
    <Paper className={classes.root} key={contactAttempt.date} elevation={0}>
      <div className={classes.column}>
        <Typography className={classes.fullWidth}>
          {`${upcasedDayOfWeek} ${date} ${D.at} ${hour}h${minutes} - ${findMediumValueByType(
            contactAttempt.medium
          )}`}
        </Typography>
        <Typography>{findContactAttemptValueByType(contactAttempt.status)}</Typography>
      </div>
      {deleteFunction && <MaterialIcons type="delete" onClick={deleteFunction} />}
    </Paper>
  );
};

export default ContactAttemptLine;
ContactAttemptLine.propTypes = {
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
