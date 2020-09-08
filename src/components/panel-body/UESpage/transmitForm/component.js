import React from 'react';
import PropTypes from 'prop-types';
import D from 'i18n';

const Form = ({ closeModal, summary }) => {
  const { ok, ko } = summary;
  const txtOk = `${D.transmitOk} : ${ok}`;
  const txtKo = `${D.transmitKo} : ${ko}`;
  return (
    <>
      <div>{txtOk}</div>
      <div>{txtKo}</div>
      <button type="button" onClick={() => closeModal()}>
        {`✔ ${D.closeButton}`}
      </button>
    </>
  );
};

export default Form;
Form.propTypes = {
  closeModal: PropTypes.func.isRequired,
  summary: PropTypes.object.isRequired,
};
