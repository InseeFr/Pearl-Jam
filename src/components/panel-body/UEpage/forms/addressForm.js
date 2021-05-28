import { Button, DialogActions, DialogTitle, makeStyles, TextField } from '@material-ui/core';
import D from 'i18n';
import PropTypes from 'prop-types';
import React, { useContext, useState } from 'react';
import SurveyUnitContext from '../UEContext';

const useStyles = makeStyles(() => ({
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

const Form = ({ closeModal, save, previousValue }) => {
  const surveyUnit = useContext(SurveyUnitContext);

  /** previousValue =[ { label: D.anyOne , value: realValue }, {}, ... ] */
  /** previousData = { D.anyOne: realValue , D.anotherOne: anotherRealValue }  */
  const previousData = previousValue.reduce(
    (obj, { label, value }) => ({ ...obj, [label]: value }),
    {}
  );

  const [deliveryPoint, setDeliveryPoint] = useState(
    previousData[D.addressName] ? previousData[D.addressName] : ''
  );
  const [additionalAddress, setAdditionalAddress] = useState(
    previousData[D.addressAdditionalAddress] ? previousData[D.addressAdditionalAddress] : ''
  );
  const [number, setNumber] = useState(
    previousData[D.addressStreetName] ? previousData[D.addressStreetName] : ''
  );
  const [streetType, setStreetType] = useState(
    previousData[D.addressFullAddress] ? previousData[D.addressFullAddress] : ''
  );
  const [streetName, setStreetName] = useState(
    previousData[D.addressCountry] ? previousData[D.addressCountry] : ''
  );
  const [postcode, setpostcode] = useState(
    previousData[D.addressCity] ? previousData[D.addressCity] : ''
  );
  const [city, setCity] = useState(
    previousData[D.addressCountry] ? previousData[D.addressCountry] : ''
  );

  const buildAddress = () => ({
    l1: deliveryPoint,
    l2: additionalAddress,
    l3: number,
    l4: streetType,
    l5: streetName,
    l6: postcode,
    l7: city,
  });

  const onChange = event => {
    const key = event.target.name;
    switch (key) {
      case 'deliveryPoint':
        setDeliveryPoint(event.target.value);
        break;
      case 'additionalAddress':
        setAdditionalAddress(event.target.value);
        break;
      case 'number':
        setNumber(event.target.value);
        break;
      case 'streetType':
        setStreetType(event.target.value);
        break;
      case 'streetName':
        setStreetName(event.target.value);
        break;
      case 'postcode':
        setpostcode(event.target.value);
        break;
      case 'city':
        setCity(event.target.value);
        break;
      default:
        break;
    }
  };

  const saveUE = () => {
    save({ ...surveyUnit, address: buildAddress() });
  };

  const classes = useStyles();

  return (
    <div className={classes.column}>
      <DialogTitle id="form-dialog-title">{D.surveyUnitAddressChange}</DialogTitle>
      <TextField
        margin="dense"
        id="deliveryPoint"
        name="deliveryPoint"
        label={D.addressName}
        InputLabelProps={{ color: 'secondary' }}
        type="text"
        fullWidth
        defaultValue={deliveryPoint}
        onChange={onChange}
      />
      <TextField
        margin="dense"
        id="streetType"
        name="streetType"
        label={D.addressFullAddress}
        InputLabelProps={{ color: 'secondary' }}
        type="text"
        fullWidth
        defaultValue={streetType}
        onChange={onChange}
      />
      <TextField
        margin="dense"
        id="postcode"
        name="postcode"
        label={D.addressCity}
        InputLabelProps={{ color: 'secondary' }}
        type="text"
        fullWidth
        defaultValue={postcode}
        onChange={onChange}
      />
      <TextField
        margin="dense"
        id="city"
        name="city"
        label={D.addressCountry}
        InputLabelProps={{ color: 'secondary' }}
        type="text"
        fullWidth
        defaultValue={city}
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
  previousValue: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};
