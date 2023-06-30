import React, { useContext } from 'react';
import { addNewState, isValidForTransmission } from 'utils/functions';

import D from 'i18n';
import IconButton from 'components/common/sharedComponents/IconButton';
import PropTypes from 'prop-types';
import SurveyUnitContext from '../UEContext';
import Tooltip from '@material-ui/core/Tooltip';
import { surveyUnitStateEnum } from 'utils/enum/SUStateEnum';

const Navigation = () => {
  const { surveyUnit } = useContext(SurveyUnitContext);

  const transmit = async () => {
    const newType = surveyUnitStateEnum.WAITING_FOR_SYNCHRONIZATION.type;
    await addNewState(surveyUnit, newType);
  };
  const transmissionValidity = isValidForTransmission(surveyUnit);

  return (
    <Tooltip title={transmissionValidity ? '' : D.transmissionInvalid}>
      <span>
        <IconButton
          disabled={!transmissionValidity}
          onClickFunction={transmit}
          label={D.transmitButton}
          iconType="transmit"
        ></IconButton>
      </span>
    </Tooltip>
  );
};

export default Navigation;
Navigation.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
};
