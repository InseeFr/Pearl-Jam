import D from 'i18n';
import MaterialIcons from 'utils/icons/materialIcons';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { findContactAttemptValueByType } from 'utils/enum/ContactAttemptEnum';
import { findMediumValueByType } from 'utils/enum/MediumEnum';
import format from 'date-fns/format';
import { fr } from 'date-fns/locale';
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
    alignItems: 'center',
    borderRadius: '15px',
    backgroundColor: grey[100],
    padding: '0.5em',
    '&:not(:last-child)': { marginBottom: '1em' },
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

const ContactAttemptLine = ({ contactAttempt, deleteFunction, editionFunction }) => {
  const classes = useStyles();
  if (contactAttempt === undefined) return '';

  const day = format(new Date(contactAttempt.date), 'EEEE', {
    locale: fr,
  });
  const dayOfWeek = day[0].toUpperCase() + day.slice(1);
  const date = format(new Date(contactAttempt.date), 'dd MMMM', {
    locale: fr,
  });
  const hour = format(new Date(contactAttempt.date), 'HH');
  const minutes = format(new Date(contactAttempt.date), 'mm');

  return (
    <Paper className={classes.root} key={contactAttempt.date} elevation={0}>
      <div className={classes.column}>
        <Typography>
          {`${dayOfWeek} ${date} ${D.at} ${hour}h${minutes} - ${findMediumValueByType(
            contactAttempt.medium
          )}`}
        </Typography>
        <Typography>{findContactAttemptValueByType(contactAttempt.status)}</Typography>
      </div>
      <div>
        {editionFunction && <MaterialIcons type="pen" onClick={editionFunction} />}
        {deleteFunction && <MaterialIcons type="delete" onClick={deleteFunction} />}
      </div>
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
// ContactAttemptLine.defaultProps = {
//   deleteParams: { deleteFunction: () => {}, deleteIsAvailable: false },
//   selected: false,
//   contactAttempt: { date: new Date().getTime(), id: 999, status: 'NOC' },
// };
