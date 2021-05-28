import { Grid } from '@material-ui/core';
import formEnum from 'common-tools/enum/formEnum';
import { getMailData, getPhoneData, getUserData } from 'common-tools/functions';
import D from 'i18n';
import PropTypes from 'prop-types';
import React from 'react';
import AtomicInfoTile from '../atomicInfoTile';
import DetailTile from './detailTile';
import PhoneTile from './phoneTile';

const Contact = ({ person, selectFormType, setInjectableData, index }) => {
  return (
    <DetailTile label={`${D.surveyUnitIndividual} ${index}`}>
      <Grid container>
        <AtomicInfoTile
          iconType="user"
          data={getUserData(person)}
          onClickFunction={() => {
            selectFormType(formEnum.USER, true);
            setInjectableData(person);
          }}
        />
        <PhoneTile
          phoneNumbers={getPhoneData(person)}
          onClickFunction={() => {
            selectFormType(formEnum.PHONE, true);
            setInjectableData(person);
          }}
        ></PhoneTile>

        <AtomicInfoTile
          iconType="mail"
          data={getMailData(person)}
          onClickFunction={() => {
            selectFormType(formEnum.MAIL, true);
            setInjectableData(person);
          }}
        />
      </Grid>
    </DetailTile>
  );
};

export default Contact;
Contact.propTypes = {
  selectFormType: PropTypes.func.isRequired,
  setInjectableData: PropTypes.func.isRequired,
  person: PropTypes.shape({}).isRequired,
  index: PropTypes.number.isRequired,
};
