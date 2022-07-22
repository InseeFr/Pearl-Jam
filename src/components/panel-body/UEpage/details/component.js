import React, { useContext } from 'react';

import Contact from './contact';
import PropTypes from 'prop-types';
import SurveyUnitContext from '../UEContext';
import { personPlaceholder } from 'utils/functions';

const UEItem = ({ selectFormType, setInjectableData }) => {
  const { surveyUnit } = useContext(SurveyUnitContext);
  const { persons } = surveyUnit;
  const sortedPersons = persons?.sort((a, b) => b.privileged - a.privileged);
  return (
    <>
      {persons && (
        <Contact
          persons={sortedPersons}
          selectFormType={selectFormType}
          setInjectableData={setInjectableData}
        />
      )}
      {(!persons || persons.length === 0) && (
        <Contact
          persons={personPlaceholder}
          selectFormType={selectFormType}
          setInjectableData={setInjectableData}
        />
      )}
      {/* <DetailTile label={D.surveyUnitHousing}>
        <AtomicInfoTile
          iconType="home"
          data={getAddressData(surveyUnit)}
          onClickFunction={() => selectFormType(formEnum.ADDRESS, true)}
        />
      </DetailTile> */}
    </>
  );
};

export default UEItem;
UEItem.propTypes = {
  selectFormType: PropTypes.func.isRequired,
  setInjectableData: PropTypes.func.isRequired,
};
