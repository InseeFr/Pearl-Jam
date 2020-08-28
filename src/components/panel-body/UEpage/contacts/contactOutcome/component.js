import React /* , { useContext } */ from 'react';
/* import PropTypes from 'prop-types'; */
import D from 'i18n';
/* import SurveyUnitContext from '../../UEContext'; */
import { findContactOutcomeValueByType } from 'common-tools/enum/ContactOutcomEnum';

const ContactOutcome = (/* { saveUE } */) => {
  /* const ue = useContext(SurveyUnitContext); */
  const outcome = {
    date: 1590055200000,
    totalNumberOfContactAttempts: 3,
    type: 'INA',
  };

  const outcomeValue = findContactOutcomeValueByType(outcome.type);
  return (
    <div className="ContactOutcome">
      <div className="row">
        <h2>{D.contactOutcome}</h2>
        <button type="button" className="bottom-right">
          <i className="fa fa-pencil" aria-hidden="true" />
          &nbsp;
          {D.editButton}
        </button>
      </div>
      <div className="line">{outcomeValue}</div>
      <div className="line">{`(${outcome.totalNumberOfContactAttempts} essais)`}</div>
    </div>
  );
};

export default ContactOutcome;
/* ContactOutcome.propTypes = {
  saveUE: PropTypes.func.isRequired,
}; */
