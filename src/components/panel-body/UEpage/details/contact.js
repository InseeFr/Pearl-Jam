import { Grid } from '@material-ui/core';
import formEnum from 'utils/enum/formEnum';
import { getMailData, getPhoneData, getUserData } from 'utils/functions';
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
          key="user"
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
          key="mail"
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
