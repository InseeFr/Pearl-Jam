import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import D from 'i18n';
import { findContactOutcomeValueByType } from 'common-tools/enum/ContactOutcomEnum';
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

  const outcomeValue = findContactOutcomeValueByType(contactOutcome.type);
  return (
    <>
      <div className="ContactOutcome">
        <div className="row">
          <h2>{D.contactOutcome}</h2>
          <button type="button" className="bottom-right" onClick={() => openModal()}>
            <i className="fa fa-pencil" aria-hidden="true" />
            &nbsp;
            {D.editButton}
          </button>
        </div>
        <div className="line">{outcomeValue}</div>
        <div className="line">
          <i className="fa fa-arrow-right" />
          <p>{`${contactOutcome.totalNumberOfContactAttempts} ${D.contactOutcomeAttempts}`}</p>
        </div>
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
