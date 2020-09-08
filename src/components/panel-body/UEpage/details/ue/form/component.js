import React, { useState } from 'react';
import D from 'i18n';

const Form = ({ closeModal, surveyUnit, saveUE }) => {
  const useField = defaultValue => {
    const [lastName, setLastName] = useState(defaultValue.lastName);
    const [firstName, setFirstName] = useState(defaultValue.firstName);

    const onChange = event => {
      let key = event.target.name;
      switch (key) {
        case 'lastName':
          setLastName(event.target.value);
          break;
        case 'firstName':
          setFirstName(event.target.value);
          break;
        default:
          break;
      }
    };
    return {
      lastName,
      firstName,
      onChange,
    };
  };

  const ueState = useField(surveyUnit);

  const saveTempUE = () => {
    surveyUnit.lastName = ueState.lastName;
    surveyUnit.firstName = ueState.firstName;
    saveUE(surveyUnit);
  };

  return (
    <>
      <h3>{`${D.surveyUnitNameChange}`}</h3>
      <form onSubmit={saveTempUE}>
        <label htmlFor="lastName">
          {`${D.surveyUnitLastName} :`}
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={ueState.lastName || ''}
            onChange={ueState.onChange}
          />
        </label>
        <label htmlFor="firstName">
          {`${D.surveyUnitFirstName} :`}
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={ueState.firstName || ''}
            onChange={ueState.onChange}
          />
        </label>
      </form>

      <button type="button" onClick={saveTempUE}>
        <i className="fa fa-check" aria-hidden="true" />
        &nbsp;
        {D.validateButton}
      </button>
      <button type="button" onClick={closeModal}>
        <i className="fa fa-times" aria-hidden="true" />
        &nbsp;
        {D.cancelButton}
      </button>
    </>
  );
};

export default Form;
