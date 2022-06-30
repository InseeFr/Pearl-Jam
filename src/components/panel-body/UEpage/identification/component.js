import React, { useContext } from 'react';

import AtomicInfoTile from '../atomicInfoTile';
import SurveyUnitContext from '../UEContext';
import formEnum from 'utils/enum/formEnum';
import { getIdentificationData } from 'utils/functions';

const Identification = ({ selectFormType, setInjectableData }) => {
  const { surveyUnit } = useContext(SurveyUnitContext);

  return (
    <>
      <AtomicInfoTile
        iconType="googles"
        data={getIdentificationData(surveyUnit)}
        onClickFunction={() => {
          selectFormType(formEnum.IDENTIFICATION, true);
          setInjectableData(surveyUnit);
        }}
      ></AtomicInfoTile>
    </>
  );
};

export default Identification;
Identification.propTypes = {};
