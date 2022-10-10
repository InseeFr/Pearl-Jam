import D from 'i18n';
import Divider from '@material-ui/core/Divider';
import LabelledBoolean from 'components/common/sharedComponents/LabelledBoolean';
import LabelledText from 'components/common/sharedComponents/LabelledText';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5em',
  },
  row: { display: 'flex', flexDirection: 'row', gap: '1em' },
}));

const Housing = ({ address }) => {
  const classes = useStyles();
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
  } = address;

  return (
    <Paper className={classes.row} elevation={0}>
      <div className={classes.column}>
        <LabelledText labelText={D.addressDeliveryPoint} value={deliveryPoint} />
        <LabelledText labelText={D.addressAdditionalAddress} value={additionalAddress} />
        <LabelledText labelText={D.addressStreetName} value={streetName} />
        <LabelledText labelText={D.addressLocality} value={locality} />
        <LabelledText labelText={D.addressPostcode} value={postCode} />
        <LabelledText labelText={D.addressCity} value={cityName} />
      </div>
      <Divider orientation="vertical" flexItem className={classes.spaceAround} />
      <div className={classes.column}>
        <LabelledText labelText={D.addressBuilding} value={building} />
        <LabelledText labelText={D.addressFloor} value={floor} />
        <LabelledText labelText={D.addressDoor} value={door} />
        <LabelledText labelText={D.addressStaircase} value={staircase} />
        <LabelledBoolean labelText={D.addressElevator} value={elevator} />
        <LabelledBoolean labelText={D.addressCityPriorityDistrict} value={cityPriorityDistrict} />
      </div>
    </Paper>
  );
};

export default Housing;
Housing.propTypes = {
  l1: PropTypes.string.isRequired,
};
