import React, { useState } from 'react';
import D from 'i18n';

const Form = ({ closeModal, surveyUnit, saveUE }) => {
  const useField = defaultValue => {
    const [phone, setPhone] = useState([...defaultValue]);

    const onChange = event => {
      const key = event.target.name;
      const index = parseInt(key.replace('phone-', ''), 10);
      phone[index] = event.target.value;
      setPhone(phone.slice());
    };

    const addPhone = () => {
      setPhone([...phone, '']);
    };

    return {
      phone,
      addPhone,
      onChange,
    };
  };

  const phoneField = useField(surveyUnit.phoneNumbers);

  const save = () => {
    surveyUnit.phoneNumbers = phoneField.phone;
    saveUE(surveyUnit);
  };

  return (
    <>
      <h3>{D.surveyUnitPhoneChange}</h3>
      <form onSubmit={save}>
        {phoneField.phone &&
          phoneField.phone.map((phoneNumber, index) => (
            <label key={index}>
              <input
                autoFocus={index === 0}
                type="tel"
                id={`phone-${index}`}
                name={`phone-${index}`}
                value={phoneNumber}
                onChange={phoneField.onChange}
              />
            </label>
          ))}
      </form>

      <button type="button" onClick={phoneField.addPhone}>
        <i className="fa fa-plus" aria-hidden="true" />
        &nbsp;
        {D.addPhoneNumberButton}
      </button>
      <button type="button" onClick={save}>
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
