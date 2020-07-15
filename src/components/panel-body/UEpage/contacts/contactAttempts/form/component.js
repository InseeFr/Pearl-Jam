import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import contactAttemptDBService from 'indexedbb/services/contactAttempt-idb-service';
import contactAttemptEnum from 'common-tools/enum/ContactAttemptEnum';
import './form.scss';
import D from 'i18n';

const Form = ({ closeModal, surveyUnit, setContactAttempt, contactAttempt, saveUE }) => {
  const [formIsValid, setFormIsValid] = useState(false);

  const onChange = event => {
    const newStatus = event.target.value;
    const newDate = new Date().getTime();
    setContactAttempt({ ...contactAttempt, status: newStatus, date: newDate });
  };

  useEffect(() => {
    const checkForm = () => {
      const { status } = contactAttempt;
      const isValid = Object.keys(contactAttemptEnum)
        .map(enumKey => {
          return contactAttemptEnum[enumKey].type;
        })
        .includes(status);

      if (isValid !== formIsValid) setFormIsValid(isValid);
    };

    checkForm();
  }, [contactAttempt, formIsValid]);

  const save = async () => {
    const { contactAttempts } = surveyUnit;
    let { id } = contactAttempt;
    const newSu = surveyUnit;

    if (id === undefined) {
      id = await contactAttemptDBService.insert(contactAttempt);
    } else {
      await contactAttemptDBService.update(contactAttempt);
    }

    if (!contactAttempts.includes(id)) {
      contactAttempts.push(id);
      newSu.contactAttempts = contactAttempts;
    }
    saveUE(newSu);
  };

  return (
    <div className="form">
      <label htmlFor="contactAttemptResult">
        <p className="title">{D.contactAttempt}</p>
        <select
          type="list"
          id="contactAttemptResult"
          name="contactAttemptResult"
          onChange={onChange}
          defaultValue="placeholder"
          required
        >
          <option disabled hidden value="placeholder">
            Choose an option
          </option>
          <option value={contactAttemptEnum.ANSWERING_MACHINE.type}>
            {contactAttemptEnum.ANSWERING_MACHINE.value}
          </option>
          <option value={contactAttemptEnum.BUSY_LINE.type}>
            {contactAttemptEnum.BUSY_LINE.value}
          </option>
          <option value={contactAttemptEnum.CONTACT_MADE.type}>
            {contactAttemptEnum.CONTACT_MADE.value}
          </option>
          <option value={contactAttemptEnum.NO_CONTACT.type}>
            {contactAttemptEnum.NO_CONTACT.value}
          </option>
          <option value={contactAttemptEnum.NUMBER_NOT_IN_USE.type}>
            {contactAttemptEnum.NUMBER_NOT_IN_USE.value}
          </option>
        </select>
      </label>
      <div className="buttonsGroup">
        <button type="button" onClick={closeModal}>
          {`✗ ${D.cancelButton}`}
        </button>
        <button type="button" onClick={save} disabled={!formIsValid}>
          {`✔ ${D.saveButton}`}
        </button>
      </div>
    </div>
  );
};

export default Form;
Form.propTypes = {
  surveyUnit: PropTypes.shape({
    contactAttempts: PropTypes.array,
    id: PropTypes.string,
  }).isRequired,
  saveUE: PropTypes.func.isRequired,
  setContactAttempt: PropTypes.func.isRequired,
  contactAttempt: PropTypes.shape({
    date: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    id: PropTypes.string,
  }).isRequired,
  closeModal: PropTypes.func.isRequired,
};
Form.defaultProps = {};
