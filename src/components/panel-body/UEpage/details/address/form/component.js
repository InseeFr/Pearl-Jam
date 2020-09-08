import React, { useState } from 'react';
import D from 'i18n';

const Form = ({ closeModal, surveyUnit, saveUE }) => {
  const useField = defaultValue => {
    const [deliveryPoint, setDeliveryPoint] = useState(defaultValue.l1 ? defaultValue.l1 : '');
    const [additionalAddress, setAdditionalAddress] = useState(
      defaultValue.l2 ? defaultValue.l2 : ''
    );
    const [number, setNumber] = useState(defaultValue.l3 ? defaultValue.l3 : '');
    const [streetType, setStreetType] = useState(defaultValue.l4 ? defaultValue.l4 : '');
    const [streetName, setStreetName] = useState(defaultValue.l5 ? defaultValue.l5 : '');
    const [postcode, setpostcode] = useState(defaultValue.l6 ? defaultValue.l6 : '');
    const [city, setCity] = useState(defaultValue.l7 ? defaultValue.l7 : '');

    const onChange = event => {
      const key = event.target.name;
      switch (key) {
        case 'deliveryPoint':
          setDeliveryPoint(event.target.value);
          break;
        case 'additionalAddress':
          setAdditionalAddress(event.target.value);
          break;
        case 'number':
          setNumber(event.target.value);
          break;
        case 'streetType':
          setStreetType(event.target.value);
          break;
        case 'streetName':
          setStreetName(event.target.value);
          break;
        case 'postcode':
          setpostcode(event.target.value);
          break;
        case 'city':
          setCity(event.target.value);
          break;
        default:
          break;
      }
    };
    return {
      address: {
        l1: deliveryPoint,
        l2: additionalAddress,
        l3: number,
        l4: streetType,
        l5: streetName,
        l6: postcode,
        l7: city,
      },

      onChange,
    };
  };

  const addressField = useField(surveyUnit.address ? surveyUnit.address : '');

  const save = () => {
    surveyUnit.address = addressField.address;
    saveUE(surveyUnit);
  };

  return (
    <>
      <h3>{D.surveyUnitAddressChange}</h3>
      <form>
        <label htmlFor="deliveryPoint">
          {`${D.addressName} :`}
          <input
            autoFocus
            type="text"
            id="deliveryPoint"
            name="deliveryPoint"
            value={addressField.address.l1}
            onChange={addressField.onChange}
          />
        </label>
        <div hidden="hidden">
          <label htmlFor="additionalAddress">
            {`${D.addressAdditionalAddress} :`}
            <input
              type="text"
              id="additionalAddress"
              name="additionalAddress"
              value={addressField.address.l2}
              onChange={addressField.onChange}
            />
          </label>
          <label htmlFor="number">
            {`${D.addressNumber} :`}
            <input
              type="text"
              id="number"
              name="number"
              value={addressField.address.l3}
              onChange={addressField.onChange}
            />
          </label>
        </div>
        <label htmlFor="streetType">
          {`${D.addressFullAddress} :`}
          <input
            type="text"
            id="streetType"
            name="streetType"
            value={addressField.address.l4}
            onChange={addressField.onChange}
          />
        </label>
        <div hidden="hidden">
          <label htmlFor="streetName">
            {`${D.addressStreetName} :`}
            <input
              type="text"
              id="streetName"
              name="streetName"
              value={addressField.address.l5}
              onChange={addressField.onChange}
            />
          </label>
        </div>
        <label htmlFor="postcode">
          {`${D.addressCity} :`}
          <input
            type="text"
            id="postcode"
            name="postcode"
            value={addressField.address.l6}
            onChange={addressField.onChange}
          />
        </label>
        <label htmlFor="city">
          {`${D.addressCountry} :`}
          <input
            type="text"
            id="city"
            name="city"
            value={addressField.address.l7}
            onChange={addressField.onChange}
          />
        </label>
      </form>

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
