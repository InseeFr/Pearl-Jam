import DateFnsUtils from '@date-io/date-fns';
import { Button, DialogActions, DialogTitle, makeStyles, TextField } from '@material-ui/core';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { getTitle } from 'common-tools/functions';
import frLocale from 'date-fns/locale/fr';
import D from 'i18n';
import PropTypes from 'prop-types';
import React, { useContext, useState } from 'react';
import SurveyUnitContext from '../UEContext';

const useStyles = makeStyles(() => ({
  column: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    width: 'max-content',
  },
}));

const Form = ({ closeModal, previousValue, save }) => {
  const surveyUnit = useContext(SurveyUnitContext);

  const [lastName, setLastName] = useState(previousValue.lastName);
  const [firstName, setFirstName] = useState(previousValue.firstName);
  const [dateOfBirth, setDateOfBirth] = useState(previousValue.birthdate);
  const [title, setTitle] = useState(previousValue.title);

  const onChange = type => event => {
    switch (type) {
      case 'lastName':
        setLastName(event.target.value);
        break;
      case 'firstName':
        setFirstName(event.target.value);
        break;
      case 'title':
        setTitle(event.target.value === getTitle('Mister') ? 'MISS' : 'MISTER');
        break;
      case 'age':
        setDateOfBirth(event.getTime());
        break;
      default:
        break;
    }
  };

  const saveUE = () => {
    const { id } = previousValue;
    const { persons } = surveyUnit;
    const newPersons = persons.map(person => {
      if (person.id === id)
        person = { ...person, lastName, firstName, title, birthdate: dateOfBirth };
      return person;
    });
    save({ ...surveyUnit, persons: newPersons });
  };

  const classes = useStyles();

  class FrLocalizedUtils extends DateFnsUtils {
    getDatePickerHeaderText(date) {
      return this.format(date, 'd MMM yyyy', { locale: this.locale });
    }
  }

  return (
    <div className={classes.column}>
      <DialogTitle id="form-dialog-title">{D.surveyUnitNameChange}</DialogTitle>

      <TextField
        margin="dense"
        id="title"
        name="title"
        label={D.surveyUnitTitle}
        InputLabelProps={{ color: 'secondary' }}
        type="text"
        fullWidth
        value={getTitle(title) || ''}
        onClick={onChange('title')}
      />

      <TextField
        margin="dense"
        id="lastName"
        name="lastName"
        label={D.surveyUnitLastName}
        InputLabelProps={{ color: 'secondary' }}
        type="text"
        fullWidth
        defaultValue={lastName || ''}
        onChange={onChange('lastName')}
      />
      <TextField
        margin="dense"
        id="firstName"
        name="firstName"
        label={D.surveyUnitFirstName}
        InputLabelProps={{ color: 'secondary' }}
        type="text"
        fullWidth
        defaultValue={firstName || ''}
        onChange={onChange('firstName')}
      />
      <MuiPickersUtilsProvider utils={FrLocalizedUtils} locale={frLocale}>
        <DatePicker
          disableFuture
          openTo="date"
          format="dd/MM/yyyy"
          label={D.surveyUnitDateOfBirth}
          views={['date', 'month', 'year']}
          InputLabelProps={{ color: 'secondary' }}
          value={dateOfBirth}
          onChange={onChange('age')}
        />
      </MuiPickersUtilsProvider>

      <DialogActions>
        <Button type="button" onClick={saveUE}>
          <i className="fa fa-check" aria-hidden="true" />
          &nbsp;
          {D.validateButton}
        </Button>
        <Button type="button" onClick={closeModal}>
          <i className="fa fa-times" aria-hidden="true" />
          &nbsp;
          {D.cancelButton}
        </Button>
      </DialogActions>
    </div>
  );
};

export default Form;
Form.propTypes = {
  closeModal: PropTypes.func.isRequired,
  previousValue: PropTypes.shape({
    lastName: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
  }).isRequired,
  save: PropTypes.func.isRequired,
};
