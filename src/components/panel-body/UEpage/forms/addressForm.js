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
    <GenericTile title={D.surveyUnitAddressChange} icon={() => <MaterialIcons type="home" />}>
      <div className={classes.row}>
        <div className={classes.column}>
          <EditableTextField
            id={'deliveryPoint'}
            label={D.addressDeliveryPoint}
            defaultValue={deliveryPoint}
            onChangeFunction={onChange}
          />
          <EditableTextField
            id={'additionalAddress'}
            label={D.addressAdditionalAddress}
            defaultValue={additionalAddress}
            onChangeFunction={onChange}
          />
          <EditableTextField
            id={'streetName'}
            label={D.addressStreetName}
            defaultValue={streetName}
            onChangeFunction={onChange}
          />
          <EditableTextField
            id={'locality'}
            label={D.addressLocality}
            defaultValue={locality}
            onChangeFunction={onChange}
          />
          <EditableTextField
            id={'postcode'}
            label={D.addressPostcode}
            defaultValue={postcode}
            onChangeFunction={onChange}
          />
          <EditableTextField
            id={'city'}
            label={D.addressCity}
            defaultValue={city}
            onChangeFunction={onChange}
          />
        </div>
        <Divider key={`splitter`} orientation="vertical" flexItem />
        <div className={classes.column}>
          <EditableTextField
            id={'building'}
            label={D.addressBuilding}
            defaultValue={building}
            onChangeFunction={onChange}
          />
          <EditableTextField
            id={'floor'}
            label={D.addressFloor}
            defaultValue={floor}
            onChangeFunction={onChange}
          />
          <EditableTextField
            id={'door'}
            label={D.addressDoor}
            defaultValue={door}
            onChangeFunction={onChange}
          />
          <EditableTextField
            id={'staircase'}
            label={D.addressStaircase}
            defaultValue={staircase}
            onChangeFunction={onChange}
          />
          <EditableBooleanField
            id="elevator"
            label={D.addressElevator}
            defaultValue={elevator}
            onChangeFunction={onChange}
          />
          <EditableBooleanField
            id="cityPriorityDistrict"
            label={D.addressCityPriorityDistrict}
            defaultValue={cityPriorityDistrict}
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
