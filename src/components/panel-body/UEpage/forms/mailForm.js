import { Button, DialogActions, DialogTitle, makeStyles, TextField } from '@material-ui/core';
import MaterialIcons from 'common-tools/icons/materialIcons';
import D from 'i18n';
import PropTypes from 'prop-types';
import React, { useContext, useState } from 'react';
import SurveyUnitContext from '../UEContext';

const useStyles = makeStyles(() => ({
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
}));

const Form = ({ closeModal, save, previousValue }) => {
  const surveyUnit = useContext(SurveyUnitContext);
  const [email, setEmail] = useState(previousValue.email);
  const [favoriteEmail, setFavoriteEmail] = useState(previousValue.favoriteEmail);

  const onChange = event => {
    if (event.target.name === 'email') {
      setEmail(event.target.value);
    }
  };

  const saveUE = () => {
    const { id } = previousValue;
    const { persons } = surveyUnit;
    const newPersons = persons.map(person => {
      if (person.id === id) person = { ...person, email, favoriteEmail };
      return person;
    });
    save({ ...surveyUnit, persons: newPersons });
  };

  const classes = useStyles();

  return (
    <div className={classes.column}>
      <DialogTitle id="form-dialog-title">{D.surveyUnitEmailChange}</DialogTitle>
      <div className={classes.row}>
        <MaterialIcons
          type={favoriteEmail ? 'starFull' : 'starOutlined'}
          onClick={() => setFavoriteEmail(prev => !prev)}
        />
        <TextField
          margin="dense"
          id="email"
          name="email"
          label={D.surveyUnitEmail}
          InputLabelProps={{ color: 'secondary' }}
          type="text"
          fullWidth
          defaultValue={email || ''}
          onChange={onChange}
        />
      </div>
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
  save: PropTypes.func.isRequired,
  previousValue: PropTypes.shape({
    id: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    favoriteEmail: PropTypes.bool.isRequired,
  }).isRequired,
  closeModal: PropTypes.func.isRequired,
};
