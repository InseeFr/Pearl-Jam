import React, { useContext, useState } from 'react';

import Button from '@material-ui/core/Button';
import D from 'i18n';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import SurveyUnitContext from '../UEContext';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

const Form = ({ closeModal, save, previousValue }) => {
  const { surveyUnit } = useContext(SurveyUnitContext);

  const previousData = previousValue.reduce(
    (obj, { label, value }) => ({ ...obj, [label]: value }),
    {}
  );

  const [deliveryPoint, setDeliveryPoint] = useState(previousData[D.addressDeliveryPoint] ?? '');
  const [additionalAddress, setAdditionalAddress] = useState(
    previousData[D.addressAdditionalAddress] ?? ''
  );
  const [streetName, setStreetName] = useState(previousData[D.addressStreetName] ?? '');
  const [locality, setLocality] = useState(previousData[D.addressLocality] ?? '');
  const [postcode, setPostcode] = useState(previousData[D.addressPostcode] ?? '');
  const [city, setCity] = useState(previousData[D.addressCity] ?? '');
  const [building, setBuilding] = useState(previousData[D.addressBuilding] ?? '');
  const [floor, setFloor] = useState(previousData[D.addressFloor] ?? '');
  const [door, setDoor] = useState(previousData[D.addressDoor] ?? '');
  const [staircase, setStaircase] = useState(previousData[D.addressStaircase] ?? '');
  const [elevator, setElevator] = useState(previousData[D.addressElevator] ?? '');
  const [cityPriorityDistrict, setCityPriorityDistrict] = useState(
    previousData[D.addressCityPriorityDistrict] ?? ''
  );

  const buildAddress = surveyUnit => {
    const { address } = surveyUnit;
    return {
      l1: address.l1,
      l2: deliveryPoint,
      l3: additionalAddress,
      l4: streetName,
      l5: locality,
      l6: `${postcode} ${city}`,
      building,
      floor,
      door,
      staircase,
      elevator,
      cityPriorityDistrict,
    };
  };

  const onChange = event => {
    const key = event.target.name;
    const value = event.target.value.trim();
    const checked = event.target.checked;
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
      case 'building':
        setBuilding(value);
        break;
      case 'floor':
        setFloor(value);
        break;
      case 'door':
        setDoor(value);
        break;
      case 'staircase':
        setStaircase(value);
        break;
      case 'elevator':
        setElevator(checked);
        break;
      case 'cityPriorityDistrict':
        setCityPriorityDistrict(checked);
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
      <TextField
        margin="dense"
        id="building"
        name="building"
        label={D.addressBuilding}
        InputLabelProps={{ color: 'secondary' }}
        type="text"
        fullWidth
        defaultValue={building}
        onChange={onChange}
      />
      <TextField
        margin="dense"
        id="floor"
        name="floor"
        label={D.addressFloor}
        InputLabelProps={{ color: 'secondary' }}
        type="text"
        fullWidth
        defaultValue={floor}
        onChange={onChange}
      />
      <TextField
        margin="dense"
        id="door"
        name="door"
        label={D.addressDoor}
        InputLabelProps={{ color: 'secondary' }}
        type="text"
        fullWidth
        defaultValue={door}
        onChange={onChange}
      />
      <TextField
        margin="dense"
        id="staircase"
        name="staircase"
        label={D.addressStaircase}
        InputLabelProps={{ color: 'secondary' }}
        type="text"
        fullWidth
        defaultValue={staircase}
        onChange={onChange}
      />
      <TextField
        margin="dense"
        id="elevator"
        name="elevator"
        label={D.addressElevator}
        InputLabelProps={{ color: 'secondary' }}
        type="checkbox"
        fullWidth
        inputProps={{ checked: elevator }}
        onChange={onChange}
      />
      <TextField
        margin="dense"
        id="cityPriorityDistrict"
        name="cityPriorityDistrict"
        label={D.addressCityPriorityDistrict}
        InputLabelProps={{ color: 'secondary' }}
        type="checkbox"
        fullWidth
        inputProps={{ checked: cityPriorityDistrict }}
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
