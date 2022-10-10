import React, { useContext, useState } from 'react';

import D from 'i18n';
import DialogActions from '@material-ui/core/DialogActions';
import { Divider } from '@material-ui/core';
import { EditableBooleanField } from 'components/common/sharedComponents/EditableBooleanField';
import { EditableTextField } from 'components/common/sharedComponents/EditableTextField';
import GenericTile from 'components/common/sharedComponents/GenericTile';
import IconButton from 'components/common/sharedComponents/IconButton';
import MaterialIcons from 'utils/icons/materialIcons';
import PropTypes from 'prop-types';
import SurveyUnitContext from '../UEContext';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1em',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    gap: '1em',
  },
}));

const Form = ({ closeModal, save, previousValue }) => {
  const { surveyUnit } = useContext(SurveyUnitContext);

  const {
    deliveryPoint,
    additionalAddress,
    streetName,
    locality,
    postCode,
    building,
    cityName,
    floor,
    door,
    staircase,
    elevator,
    cityPriorityDistrict,
  } = previousValue;

  const [deliveryPointForm, setDeliveryPoint] = useState(deliveryPoint);
  const [additionalAddressForm, setAdditionalAddress] = useState(additionalAddress);
  const [streetNameForm, setStreetName] = useState(streetName);
  const [localityForm, setLocality] = useState(locality);
  const [postcodeForm, setPostcode] = useState(postCode);
  const [cityForm, setCity] = useState(cityName);
  const [buildingForm, setBuilding] = useState(building);
  const [floorForm, setFloor] = useState(floor);
  const [doorForm, setDoor] = useState(door);
  const [staircaseForm, setStaircase] = useState(staircase);
  const [elevatorForm, setElevator] = useState(elevator);
  const [cityPriorityDistrictForm, setCityPriorityDistrict] = useState(cityPriorityDistrict);

  const buildAddress = surveyUnit => {
    const { address } = surveyUnit;
    return {
      l1: address.l1,
      l2: deliveryPointForm,
      l3: additionalAddressForm,
      l4: streetNameForm,
      l5: localityForm,
      l6: `${postcodeForm} ${cityForm}`,
      building: buildingForm,
      floor: floorForm,
      door: doorForm,
      staircase: staircaseForm,
      elevator: elevatorForm,
      cityPriorityDistrict: cityPriorityDistrictForm,
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
    <GenericTile title={D.surveyUnitAddressChange} icon={() => <MaterialIcons type="home" />}>
      <div className={classes.row}>
        <div className={classes.column}>
          <EditableTextField
            id={'deliveryPoint'}
            label={D.addressDeliveryPoint}
            defaultValue={deliveryPointForm}
            onChangeFunction={onChange}
          />
          <EditableTextField
            id={'additionalAddress'}
            label={D.addressAdditionalAddress}
            defaultValue={additionalAddressForm}
            onChangeFunction={onChange}
          />
          <EditableTextField
            id={'streetName'}
            label={D.addressStreetName}
            defaultValue={streetNameForm}
            onChangeFunction={onChange}
          />
          <EditableTextField
            id={'locality'}
            label={D.addressLocality}
            defaultValue={localityForm}
            onChangeFunction={onChange}
          />
          <EditableTextField
            id={'postcode'}
            label={D.addressPostcode}
            defaultValue={postcodeForm}
            onChangeFunction={onChange}
          />
          <EditableTextField
            id={'city'}
            label={D.addressCity}
            defaultValue={cityForm}
            onChangeFunction={onChange}
          />
        </div>
        <Divider key={`splitter`} orientation="vertical" flexItem />
        <div className={classes.column}>
          <EditableTextField
            id={'building'}
            label={D.addressBuilding}
            defaultValue={buildingForm}
            onChangeFunction={onChange}
          />
          <EditableTextField
            id={'floor'}
            label={D.addressFloor}
            defaultValue={floorForm}
            onChangeFunction={onChange}
          />
          <EditableTextField
            id={'door'}
            label={D.addressDoor}
            defaultValue={doorForm}
            onChangeFunction={onChange}
          />
          <EditableTextField
            id={'staircase'}
            label={D.addressStaircase}
            defaultValue={staircaseForm}
            onChangeFunction={onChange}
          />
          <EditableBooleanField
            id="elevator"
            label={D.addressElevator}
            defaultValue={elevatorForm}
            onChangeFunction={onChange}
          />
          <EditableBooleanField
            id="cityPriorityDistrict"
            label={D.addressCityPriorityDistrict}
            defaultValue={cityPriorityDistrictForm}
            onChangeFunction={onChange}
          />
        </div>
      </div>

      <DialogActions>
        <IconButton iconType="check" label={D.validateButton} onClickFunction={() => saveUE()} />
        <IconButton iconType="close" label={D.cancelButton} onClickFunction={closeModal} />
      </DialogActions>
    </GenericTile>
  );
};

export default Form;
Form.propTypes = {
  closeModal: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  previousValue: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};
