import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import D from 'i18n';
import format from 'date-fns/format';
import Form from './form';
import SurveyUnitContext from '../../UEContext';

const ContactAttempts = ({ saveUE }) => {
  const ue = useContext(SurveyUnitContext);
  const [contactAttempt, setContactAttempt] = useState({ status: 'titi', date: 12345 });
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const lines = () => {
    // TODO use real indexedDB data -> const {contactAttempts }= ue;
    const contactAttempts = [
      {
        date: 1589986800000,
        status: 'BUL',
        id: 125,
      },
      {
        date: 1589986800000,
        status: 'BUL',
        id: 126,
      },
      {
        date: 1589994000000,
        status: 'BUL',
        id: 127,
      },
      {
        date: 1590055200000,
        status: 'COM',
        id: 128,
      },
    ];
    if (Array.isArray(contactAttempts) && contactAttempts.length > 0)
      return contactAttempts.map(contAtt => {
        const date = format(new Date(contAtt.date), 'dd/MM/yyyy');
        const hour = format(new Date(contAtt.date), 'H');

        return (
          <div className="line" key={contAtt.id}>
            <button type="button" className="smallButton">{` 🗑 `}</button>
            <div>{`${date} - ${hour}H - Téléphone - ${contAtt.status}`}</div>
            <button type="button" className="smallButton">{` ✎ `}</button>
          </div>
        );
      });
    return <div>No data to process</div>;
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const save = surveyUnit => {
    saveUE(surveyUnit);
    closeModal();
  };

  return (
    <div className="ContactAttempts">
      <h2>{D.contactAttempts}</h2>
      {lines()}

      <button type="button" className="bottom-right" onClick={openModal}>
        {` + ${D.addButton}`}
      </button>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal">
        <Form
          closeModal={closeModal}
          surveyUnit={ue}
          setContactAttempt={setContactAttempt}
          contactAttempt={contactAttempt}
          saveUE={save}
        />
      </Modal>
    </div>
  );
};

export default ContactAttempts;
ContactAttempts.propTypes = {
  saveUE: PropTypes.func.isRequired,
};
