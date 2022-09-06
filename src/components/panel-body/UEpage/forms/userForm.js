import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import React, { useContext, useEffect, useState } from 'react';
import { getTitle, getToggledTitle, isTitleMister, sortPhoneNumbers } from 'utils/functions';

import Button from '@material-ui/core/Button';
import D from 'i18n';
import DateFnsUtils from '@date-io/date-fns';
import DialogActions from '@material-ui/core/DialogActions';
import { Divider } from '@material-ui/core';
import { EditableTextField } from 'components/common/niceComponents/EditableTextField';
import { EditableTextFieldWithClickableIcon } from 'components/common/niceComponents/EditableTextFieldWithClickableIcon';
import GenericTile from 'components/common/niceComponents/GenericTile';
import IconButton from 'components/common/niceComponents/IconButton';
import { LabelledSwitch } from 'components/common/niceComponents/LabelledSwitch';
import MaterialIcons from 'utils/icons/materialIcons';
import PropTypes from 'prop-types';
import SurveyUnitContext from '../UEContext';
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
    flexDirection: 'row',
    gap: '1em',
  },
}));

const Form = ({ closeModal, previousValue, save }) => {
  const classes = useStyles();

  const { surveyUnit } = useContext(SurveyUnitContext);
  const [persons, setPersons] = useState(previousValue);

  useEffect(() => {
    if (!persons) setPersons(surveyUnit.persons);
  }, [persons, surveyUnit]);

  const onTitleChange = personId => {
    const updatedPersons = persons.map(person => {
      if (person.id !== personId) return person;
      return { ...person, title: getToggledTitle(person.title) };
    });
    console.log(updatedPersons);
    setPersons(updatedPersons);
  };

  const onEmailChange = (personId, newEmail) => {
    const updatedPersons = persons.map(person => {
      if (personId.id !== personId) return person;
      return { ...person, email: newEmail };
    });
    setPersons(updatedPersons);
  };

  const onFavoriteEmailChange = personId => {
    const updatedPersons = persons.map(person => {
      if (person.id !== personId) return person;
      return { ...person, favoriteEmail: !person.favoriteEmail };
    });
    setPersons(updatedPersons);
  };

  const onLastNameChange = (personId, newLastName) => {
    const updatedPersons = persons.map(person => {
      if (personId.id !== personId) return person;
      return { ...person, lastName: newLastName };
    });
    setPersons(updatedPersons);
  };

  const onFirstNameChange = (personId, newFirstName) => {
    const updatedPersons = persons.map(person => {
      if (personId.id !== personId) return person;
      return { ...person, firstName: newFirstName };
    });
    setPersons(updatedPersons);
  };

  const onDateOfBirthChange = (personId, newBirthdate) => {
    const updatedPersons = persons.map(person => {
      if (personId.id !== personId) return person;
      return { ...person, birthdate: newBirthdate };
    });
    setPersons(updatedPersons);
  };

  // const updatePhone = (phoneNumber, newValue) => {
  //   const updatedPhones = interviewerPhones.map(phNum => {
  //     if (phNum.number === phoneNumber.number) phNum.number = newValue;
  //     return phNum;
  //   });
  //   setInterviewerPhones([...updatedPhones]);
  // };

  const onPhoneNumberChange = (personId, newPhoneNumber, phoneNumber) => {
    const updatedPersons = persons.map(person => {
      if (person.id !== personId) return person;

      const updatedPhoneNumbers = person.phoneNumbers.map(personPhoneNumber => {
        if (personPhoneNumber.number !== phoneNumber) return personPhoneNumber;
        return { ...personPhoneNumber, number: newPhoneNumber.trim() };
      });
      return { ...person, phoneNumbers: updatedPhoneNumbers };
    });
    setPersons(updatedPersons);
  };

  const toggleFavoritePhoneNumber = (personId, phoneNumber) => {
    const updatedPersons = persons.map(person => {
      if (person.id !== personId) return person;

      const updatedPhoneNumbers = person.phoneNumbers.map(personPhoneNumber => {
        if (personPhoneNumber.number !== phoneNumber) return personPhoneNumber;
        return { ...personPhoneNumber, favorite: !personPhoneNumber.favorite };
      });
      return { ...person, phoneNumbers: updatedPhoneNumbers };
    });
    setPersons(updatedPersons);
  };

  const anyEmptyPhone = phoneNumbers => {
    return phoneNumbers.map(phone => phone.number).some(num => num.trim() === '');
  };

  const addPhone = personId => {
    const updatedPersons = persons.map(person => {
      if (person.id !== personId) return person;
      if (anyEmptyPhone(person?.phoneNumbers ?? [])) return person;
      return {
        ...person,
        phoneNumbers: [
          ...person.phoneNumbers,
          { source: 'INTERVIEWER', favorite: false, number: '' },
        ],
      };
    });
    setPersons(updatedPersons);
  };

  // const deletePhoneNumber = phoneNumber => {
  //   const updatedInterviewerPhones = interviewerPhones.filter(
  //     phNum => phNum.number !== phoneNumber
  //   );
  //   setInterviewerPhones([...updatedInterviewerPhones]);
  // };

  const saveUE = () => {
    save({ ...surveyUnit, persons });
  };

  class FrLocalizedUtils extends DateFnsUtils {
    getDatePickerHeaderText(date) {
      return this.format(date, 'd MMM yyyy', { locale: this.locale });
    }
  }
  const favoriteIcon = (favorite, onClickFunction) => (
    <MaterialIcons
      type={favorite ? 'starFull' : 'starOutlined'}
      onClick={() => onClickFunction()}
    />
  );

  return (
    <GenericTile title={D.contactAttempts} icon={() => <MaterialIcons type="home" />}>
      <div className={classes.row}>
        {persons.map((person, index) => {
          const { interviewerPhoneNumbers } = sortPhoneNumbers(person.phoneNumbers);

          return (
            <>
              {index > 0 && (
                <Divider
                  key={`splitter-${index}`}
                  orientation="vertical"
                  flexItem
                  className={classes.spaceAround}
                />
              )}
              <div className={classes.column}>
                <LabelledSwitch
                  labelText={D.surveyUnitTitle}
                  value={isTitleMister(person.title)}
                  text={getTitle(person.title)}
                  onChangeFunction={() => onTitleChange(person.id)}
                />
                <EditableTextField
                  id={'lastName'}
                  label={D.surveyUnitLastName}
                  defaultValue={person?.lastName}
                  onChangeFunction={event => onLastNameChange(person.id, event.target.value)}
                />
                <EditableTextField
                  id={'firstName'}
                  label={D.surveyUnitFirstName}
                  defaultValue={person?.firstName}
                  onChangeFunction={event => onFirstNameChange(person.id, event.target.value)}
                />

                <MuiPickersUtilsProvider utils={FrLocalizedUtils} locale={frLocale}>
                  <DatePicker
                    disableFuture
                    openTo="date"
                    format="dd/MM/yyyy"
                    label={D.surveyUnitDateOfBirth}
                    views={['date', 'month', 'year']}
                    InputLabelProps={{ color: 'secondary' }}
                    value={person.dateOfBirth}
                    onChange={event => onDateOfBirthChange(person.id, event.target.value)}
                  />
                </MuiPickersUtilsProvider>

                <div className={classes.row}>
                  <EditableTextFieldWithClickableIcon
                    id={'email'}
                    label={D.surveyUnitEmail}
                    defaultValue={person.email}
                    icon={() =>
                      favoriteIcon(person.favoriteEmail, () => onFavoriteEmailChange(person.id))
                    }
                  />
                </div>
                {interviewerPhoneNumbers.map((itwPhone, index) => (
                  <EditableTextFieldWithClickableIcon
                    id={`phone-${index}`}
                    label={[D.telephone, `(${D.interviewerSource})`]}
                    defaultValue={itwPhone.number}
                    onChangeFunction={event => {
                      console.log('event ', event);
                      onPhoneNumberChange(person.id, event.target.value);
                    }}
                    icon={() =>
                      favoriteIcon(itwPhone.favorite, () =>
                        toggleFavoritePhoneNumber(person.id, itwPhone.number)
                      )
                    }
                  />
                ))}
                <IconButton
                  iconType="add"
                  label={D.addPhoneNumberButton}
                  onClickFunction={() => addPhone(person.id)}
                />
              </div>
            </>
          );
        })}
      </div>
      <DialogActions>
        <IconButton
          iconType="check"
          label={D.validateButton}
          onClickFunction={() => console.log('saveUE')}
        />
        <IconButton iconType="close" label={D.cancelButton} onClickFunction={closeModal} />
        <Button type="button" onClick={() => console.log('saveUE')}>
          {`✔ ${D.validateButton}`}
        </Button>
        <Button type="button" onClick={closeModal}>
          {D.cancelButton}
        </Button>
      </DialogActions>
    </GenericTile>
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
