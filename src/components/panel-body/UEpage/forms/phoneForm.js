import { Button, DialogActions, DialogTitle, makeStyles } from '@material-ui/core';
import { sortPhoneNumbers } from 'common-tools/functions';
import D from 'i18n';
import PropTypes from 'prop-types';
import React, { useContext, useState } from 'react';
import PhoneTile from '../details/phoneTile';
import SurveyUnitContext from '../UEContext';

const useStyles = makeStyles(() => ({
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

const Form = ({ closeModal, save, previousValue }) => {
  // previousValue is the person in [persons]
  const surveyUnit = useContext(SurveyUnitContext);
  const { fiscalPhoneNumbers, directoryPhoneNumbers, interviewerPhoneNumbers } = sortPhoneNumbers(
    previousValue.phoneNumbers
  );

  const [interviewerPhones, setInterviewerPhones] = useState([...interviewerPhoneNumbers]);
  const [fiscalPhones, setFiscalPhones] = useState([...fiscalPhoneNumbers]);
  const [directoryPhones, setDirectoryPhones] = useState([...directoryPhoneNumbers]);

  const updatePhone = (phoneNumber, newValue) => {
    const updatedPhones = interviewerPhones.map(phNum => {
      if (phNum.number === phoneNumber.number) phNum.number = newValue;
      return phNum;
    });
    setInterviewerPhones([...updatedPhones]);
  };

  const onChange = phoneNumber => event => {
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
    const newPersons = surveyUnit.persons.map(p => {
      if (p.id !== previousValue.id) return p;
      return {
        ...p,
        phoneNumbers: [...fiscalPhones, ...directoryPhones, ...interviewerPhones],
      };
    });
    save({ ...surveyUnit, persons: newPersons });
  };

  const classes = useStyles();

  return (
    <div className={classes.column}>
      <DialogTitle id="form-dialog-title">{D.surveyUnitPhoneChange}</DialogTitle>
      <PhoneTile
        phoneNumbers={[...interviewerPhones, ...fiscalPhones, ...directoryPhones]}
        editionMode
        toggleFavoritePhone={number => toggleFavoritePhoneNumber(number)}
        updatePhoneNumber={onChange}
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
  previousValue: PropTypes.arrayOf(PropTypes.string).isRequired,
  save: PropTypes.func.isRequired,
};
