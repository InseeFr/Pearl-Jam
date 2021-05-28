import { makeStyles, Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { findContactAttemptValueByType } from 'common-tools/enum/ContactAttemptEnum';
import format from 'date-fns/format';
import { fr } from 'date-fns/locale';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles(() => ({
  button: {
    '&:hover': { cursor: 'pointer' },
    marginLeft: '0.5em',
  },
  alignEnd: {
    alignSelf: 'flex-end',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  flex: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  top: { marginTop: '0.5em' },
}));

const ContactAttemptLine = ({ contactAttempt, deleteParams, selected }) => {
  const classes = useStyles();
  if (contactAttempt === undefined) return '';
  const { deleteFunction, deleteIsAvailable } = deleteParams;

  const dayOfWeek = format(new Date(contactAttempt.date), 'EEEE', { locale: fr });
  const date = format(new Date(contactAttempt.date), 'dd/MM/yyyy');
  const hour = format(new Date(contactAttempt.date), 'HH');
  const minutes = format(new Date(contactAttempt.date), 'mm');

  return (
    <div className={classes.flex} key={contactAttempt.id}>
      <Typography className={classes.top}>
        {`${dayOfWeek} ${date} - ${hour}h${minutes} - ${findContactAttemptValueByType(
          contactAttempt.status
        )}`}
      </Typography>
      {deleteIsAvailable && (
        <DeleteIcon
          className={classes.button}
          color={selected ? 'error' : 'inherit'}
          onClick={deleteFunction}
        />
      )}
    </div>
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
ContactAttemptLine.defaultProps = {
  deleteParams: { deleteFunction: () => {}, deleteIsAvailable: false },
  selected: false,
  contactAttempt: { date: new Date().getTime(), id: 999, status: 'NOC' },
};
