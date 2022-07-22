import AtomicInfoTile from '../atomicInfoTile';
import DetailTile from './detailTile';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import formEnum from 'utils/enum/formEnum';
import { getUserData } from 'utils/functions';

const Contact = ({ persons, selectFormType, setInjectableData }) => {
  return (
    <DetailTile>
      <Grid container>
        {persons.map(person => (
          <AtomicInfoTile
            key="user"
            iconType="user"
            data={getUserData(person)}
            onClickFunction={() => {
              selectFormType(formEnum.USER, true);
              setInjectableData(person);
            }}
          />
        ))}
        {/* <AtomicInfoTile
          key="user"
          iconType="user"
          data={getUserData(person)}
          onClickFunction={() => {
            selectFormType(formEnum.USER, true);
            setInjectableData(person);
          }}
        /> */}
        {/* <PhoneTile
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
        /> */}
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
