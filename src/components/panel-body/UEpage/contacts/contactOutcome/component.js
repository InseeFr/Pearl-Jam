import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import D from 'i18n';
import Form from './form';
import SurveyUnitContext from '../../UEContext';

const ContactOutcome = ({ saveUE }) => {
  const su = useContext(SurveyUnitContext);
  const defaultContactOutcome =
    su.contactOutcome !== undefined && su.contactOutcome !== null
      ? su.contactOutcome
      : {
          date: new Date().getTime(),
          type: undefined,
          totalNumberOfContactAttempts: '0',
        };
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [contactOutcome, setContactOutcome] = useState(defaultContactOutcome);

  useEffect(() => {
    setContactOutcome(
      su.contactOutcome !== undefined && su.contactOutcome !== null
        ? su.contactOutcome
        : {
            date: new Date().getTime(),
            type: undefined,
            totalNumberOfContactAttempts: '0',
          }
    );
  }, [su]);

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
    <>
      <div className="ContactOutcome">
        <h2>{D.contactOutcome}</h2>
        {contactOutcome !== undefined &&
          contactOutcome !== null &&
          contactOutcome.type !== undefined && (
            <div>{`${contactOutcome.type} (${contactOutcome.totalNumberOfContactAttempts} attempts)`}</div>
          )}
        <button type="button" className="bottom-right" onClick={() => openModal()}>
          {` ✎ ${D.editButton}`}
        </button>
      </div>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal">
        <Form
          closeModal={closeModal}
          surveyUnit={su}
          setContactOutcome={setContactOutcome}
          contactOutcome={contactOutcome}
          saveUE={save}
        />
      </Modal>
    </>
  );
};

export default ContactOutcome;
ContactOutcome.propTypes = {
  saveUE: PropTypes.func.isRequired,
};
