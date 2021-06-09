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
    previousData[D.addressDeliveryPoint] ? previousData[D.addressDeliveryPoint] : ''
  );
  const [additionalAddress, setAdditionalAddress] = useState(
    previousData[D.addressAdditionalAddress] ? previousData[D.addressAdditionalAddress] : ''
  );
  const [streetName, setStreetName] = useState(
    previousData[D.addressStreetName] ? previousData[D.addressStreetName] : ''
  );
  const [locality, setLocality] = useState(
    previousData[D.addressLocality] ? previousData[D.addressLocality] : ''
  );
  const [postcode, setPostcode] = useState(
    previousData[D.addressPostcode] ? previousData[D.addressPostcode] : ''
  );
  const [city, setCity] = useState(previousData[D.addressCity] ? previousData[D.addressCity] : '');

  const buildAddress = surveyUnit => {
    const { address } = surveyUnit;
    return {
      l1: address.l1,
      l2: deliveryPoint,
      l3: additionalAddress,
      l4: streetName,
      l5: locality,
      l6: `${postcode} ${city}`,
    };
  };

  const onChange = event => {
    const key = event.target.name;
    const value = event.target.value.trim();
    switch (key) {
      case 'deliveryPoint':
        setDeliveryPoint(value);
        break;
      case 'additionalAddress':
        setAdditionalAddress(value);
        break;
      case 'streetName':
        setStreetName(value);
        break;
      case 'locality':
        setLocality(value);
        break;
      case 'postcode':
        setPostcode(value);
        break;
      case 'city':
        setCity(value);
        break;
      default:
        break;
    }
  };

  const saveUE = () => {
    save({ ...surveyUnit, address: buildAddress(surveyUnit) });
  };

  const classes = useStyles();

  return (
    <div className={classes.column}>
      <DialogTitle id="form-dialog-title">{D.surveyUnitAddressChange}</DialogTitle>
      <TextField
        margin="dense"
        id="deliveryPoint"
        name="deliveryPoint"
        label={D.addressDeliveryPoint}
        InputLabelProps={{ color: 'secondary' }}
        type="text"
        fullWidth
        defaultValue={deliveryPoint}
        onChange={onChange}
      />
      <TextField
        margin="dense"
        id="additionalAddress"
        name="additionalAddress"
        label={D.addressAdditionalAddress}
        InputLabelProps={{ color: 'secondary' }}
        type="text"
        fullWidth
        defaultValue={additionalAddress}
        onChange={onChange}
      />
      <TextField
        margin="dense"
        id="streetName"
        name="streetName"
        label={D.addressStreetName}
        InputLabelProps={{ color: 'secondary' }}
        type="text"
        fullWidth
        defaultValue={streetName}
        onChange={onChange}
      />
      <TextField
        margin="dense"
        id="locality"
        name="locality"
        label={D.addressLocality}
        InputLabelProps={{ color: 'secondary' }}
        type="text"
        fullWidth
        defaultValue={locality}
        onChange={onChange}
      />
      <TextField
        margin="dense"
        id="postcode"
        name="postcode"
        label={D.addressPostcode}
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
        label={D.addressCity}
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
