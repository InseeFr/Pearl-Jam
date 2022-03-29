import React from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import ContactAttempts from './contactAttempts';
import ContactOutcome from './contactOutcome';

const Contacts = ({ selectFormType, setInjectableData }) => (
  <Grid container>
    <ContactAttempts selectFormType={selectFormType} setInjectableData={setInjectableData} />
    <ContactOutcome selectFormType={selectFormType} />
  </Grid>
);

export default Contacts;
Contacts.propTypes = {
  selectFormType: PropTypes.func.isRequired,
  setInjectableData: PropTypes.func.isRequired,
};
