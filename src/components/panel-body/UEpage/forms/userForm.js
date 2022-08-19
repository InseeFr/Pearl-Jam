import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import React, { useContext, useState } from 'react';
import { getTitle, sortPhoneNumbers } from 'utils/functions';

import Button from '@material-ui/core/Button';
import D from 'i18n';
import DateFnsUtils from '@date-io/date-fns';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import MaterialIcons from 'utils/icons/materialIcons';
import PhoneTile from '../details/phoneTile';
import PropTypes from 'prop-types';
import SurveyUnitContext from '../UEContext';
import TextField from '@material-ui/core/TextField';
import frLocale from 'date-fns/locale/fr';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  column: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    width: 'max-content',
  },
  row: {
    display: 'flex',
  },
}));

const Form = ({ closeModal, previousValue, save }) => {
  const classes = useStyles();

  const { surveyUnit } = useContext(SurveyUnitContext);

  const [lastName, setLastName] = useState(previousValue.lastName);
  const [firstName, setFirstName] = useState(previousValue.firstName);
  const [dateOfBirth, setDateOfBirth] = useState(previousValue.birthdate);
  const [title, setTitle] = useState(previousValue.title);
  const { fiscalPhoneNumbers, directoryPhoneNumbers, interviewerPhoneNumbers } = sortPhoneNumbers(
    previousValue.phoneNumbers
  );
  const [email, setEmail] = useState(previousValue.email);
  const [favoriteEmail, setFavoriteEmail] = useState(previousValue.favoriteEmail);

  const [interviewerPhones, setInterviewerPhones] = useState([...interviewerPhoneNumbers]);
  const [fiscalPhones, setFiscalPhones] = useState([...fiscalPhoneNumbers]);
  const [directoryPhones, setDirectoryPhones] = useState([...directoryPhoneNumbers]);

  const onEmailChange = event => {
    if (event.target.name === 'email') {
      setEmail(event.target.value);
    }
  };

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

  const updatePhone = (phoneNumber, newValue) => {
    const updatedPhones = interviewerPhones.map(phNum => {
      if (phNum.number === phoneNumber.number) phNum.number = newValue;
      return phNum;
    });
    setInterviewerPhones([...updatedPhones]);
  };

  const onPhoneChange = phoneNumber => event => {
    updatePhone(phoneNumber, event.target.value.trim());
  };

  const toggleFavoritePhoneNumber = phoneNumber => {
    switch (phoneNumber.source.toLowerCase()) {
      case 'interviewer':
        const updatedInterviewerPhones = interviewerPhones.map(phNum => {
          if (phNum.number === phoneNumber.number) phNum.favorite = !phNum.favorite;
          return phNum;
        });
        setInterviewerPhones([...updatedInterviewerPhones]);
        break;

      case 'fiscal':
        const updatedFiscalPhones = fiscalPhones.map(phNum => {
          if (phNum.number === phoneNumber.number) phNum.favorite = !phNum.favorite;
          return phNum;
        });
        setFiscalPhones([...updatedFiscalPhones]);
        break;
      case 'directory':
        const updatedDirectoryPhones = directoryPhones.map(phNum => {
          if (phNum.number === phoneNumber.number) phNum.favorite = !phNum.favorite;
          return phNum;
        });
        setDirectoryPhones([...updatedDirectoryPhones]);
        break;

      default:
        break;
    }
  };

  const anyEmptyPhone = () => {
    return interviewerPhones.map(phone => phone.number).filter(num => num.trim() === '').length > 0;
  };

  const addPhone = () => {
    if (anyEmptyPhone()) return;
    setInterviewerPhones([
      ...interviewerPhones,
      { source: 'INTERVIEWER', favorite: false, number: '' },
    ]);
  };

  const deletePhoneNumber = phoneNumber => {
    const updatedInterviewerPhones = interviewerPhones.filter(
      phNum => phNum.number !== phoneNumber
    );
    setInterviewerPhones([...updatedInterviewerPhones]);
  };

  const saveUE = () => {
    const { id } = previousValue;
    const { persons } = surveyUnit;
    const newPersons = persons.map(person => {
      if (person.id === id)
        person = {
          ...person,
          lastName,
          firstName,
          title,
          birthdate: dateOfBirth,
          phoneNumbers: [...fiscalPhones, ...directoryPhones, ...interviewerPhones],
          email,
          favoriteEmail,
        };
      return person;
    });
    save({ ...surveyUnit, persons: newPersons });
  };

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

      <div className={classes.row}>
        <TextField
          margin="dense"
          id="email"
          name="email"
          label={D.surveyUnitEmail}
          InputLabelProps={{ color: 'secondary' }}
          type="text"
          fullWidth
          defaultValue={email || ''}
          onChange={onEmailChange}
        />
        <MaterialIcons
          type={favoriteEmail ? 'starFull' : 'starOutlined'}
          onClick={() => setFavoriteEmail(prev => !prev)}
        />
      </div>

      <PhoneTile
        phoneNumbers={[...interviewerPhones, ...fiscalPhones, ...directoryPhones]}
        editionMode
        toggleFavoritePhone={number => toggleFavoritePhoneNumber(number)}
        updatePhoneNumber={onPhoneChange}
        deletePhoneNumber={deletePhoneNumber}
      ></PhoneTile>
      <DialogActions>
        <Button type="button" onClick={addPhone}>
          {`+ ${D.addPhoneNumberButton}`}
        </Button>
        <Button type="button" onClick={saveUE}>
          {`✔ ${D.validateButton}`}
        </Button>
        <Button type="button" onClick={closeModal}>
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
