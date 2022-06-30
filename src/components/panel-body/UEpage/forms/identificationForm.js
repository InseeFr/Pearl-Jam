import React, { useState } from 'react';

import Button from '@material-ui/core/Button';
import D from 'i18n';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { getIdentificationData } from 'utils/functions';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

const Form = ({ closeModal, save, previousValue }) => {
  const previousData = getIdentificationData(previousValue).reduce(
    (obj, { label, value }) => ({ ...obj, [label]: value }),
    {}
  );

  const [identification, setIdentification] = useState(
    previousData['identification'] ? previousData['identification'] : ''
  );
  const [access, setAccess] = useState(previousData['access'] ? previousData['access'] : '');
  const [situation, setSituation] = useState(
    previousData['situation'] ? previousData['situation'] : ''
  );
  const [category, setCategory] = useState(
    previousData['category'] ? previousData['category'] : ''
  );
  const [occupant, setOccupant] = useState(
    previousData['occupant'] ? previousData['occupant'] : ''
  );
  const [move, setMove] = useState(previousValue.move || false);

  const onChange = event => {
    const key = event.target.name;
    const value = event.target.value.trim();
    const checked = event.target.checked;
    switch (key) {
      case 'identification':
        setIdentification(value);
        break;
      case 'access':
        setAccess(value);
        break;
      case 'situation':
        setSituation(value);
        break;
      case 'category':
        setCategory(value);
        break;
      case 'occupant':
        setOccupant(value);
        break;
      case 'move':
        setMove(checked);
        break;
      default:
        break;
    }
  };

  const saveUE = () => {
    save({
      ...previousValue,
      identification: {
        identification,
        access,
        situation,
        category,
        occupant,
      },
      move,
    });
  };

  const classes = useStyles();

  return (
    <div className={classes.column}>
      <DialogTitle id="form-dialog-title">{D.surveyUnitAddressChange}</DialogTitle>
      <TextField
        margin="dense"
        id="identification"
        name="identification"
        label={'identification'}
        InputLabelProps={{ color: 'secondary' }}
        type="text"
        fullWidth
        defaultValue={identification}
        onChange={onChange}
      />
      <TextField
        margin="dense"
        id="access"
        name="access"
        label={'access'}
        InputLabelProps={{ color: 'secondary' }}
        type="text"
        fullWidth
        defaultValue={access}
        onChange={onChange}
      />
      <TextField
        margin="dense"
        id="situation"
        name="situation"
        label={'situation'}
        InputLabelProps={{ color: 'secondary' }}
        type="text"
        fullWidth
        defaultValue={situation}
        onChange={onChange}
      />
      <TextField
        margin="dense"
        id="category"
        name="category"
        label={'category'}
        InputLabelProps={{ color: 'secondary' }}
        type="text"
        fullWidth
        defaultValue={category}
        onChange={onChange}
      />
      <TextField
        margin="dense"
        id="occupant"
        name="occupant"
        label={'occupant'}
        InputLabelProps={{ color: 'secondary' }}
        type="text"
        fullWidth
        defaultValue={occupant}
        onChange={onChange}
      />
      <TextField
        margin="dense"
        id="move"
        name="move"
        label="Have I moved ?"
        InputLabelProps={{ color: 'secondary' }}
        type="checkbox"
        fullWidth
        inputProps={{ checked: move }}
        onChange={onChange}
      />

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
  save: PropTypes.func.isRequired,
  previousValue: PropTypes.shape({}).isRequired,
};
