import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import D from 'i18n';
import format from 'date-fns/format';
import { findContactAttemptValueByType } from 'common-tools/enum/ContactAttemptEnum';
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
        date: 1590055200000,
        status: 'COM',
        id: 128,
      },
      {
        date: 1589994000000,
        status: 'BUL',
        id: 127,
      },
      {
        date: 1589986800000,
        status: 'BUL',
        id: 126,
      },
      {
        date: 1589986800000,
        status: 'BUL',
        id: 125,
      },
    ];
    if (Array.isArray(contactAttempts) && contactAttempts.length > 0)
      return contactAttempts.map(contAtt => {
        const date = format(new Date(contAtt.date), 'dd/MM/yyyy');
        const hour = format(new Date(contAtt.date), 'H');

        return (
          <tr className="line" key={contAtt.id}>
            <td>
              <button type="button" className="smallButton">
                <i className="fa fa-times" aria-hidden="true" />
              </button>
            </td>
            <td>
              <div>
                {`${date} - ${hour}H - Téléphone - ${findContactAttemptValueByType(
                  contAtt.status
                )}`}
              </div>
            </td>
          </tr>
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
      <div className="row">
        <h2>{D.contactAttempts}</h2>
        <button type="button" className="bottom-right" onClick={openModal}>
          <i className="fa fa-plus" aria-hidden="true" />
          &nbsp;
          {D.addButton}
        </button>
      </div>

      <table className="contactTable">
        <colgroup>
          <col className="col1" />
          <col className="col2" />
        </colgroup>
        {lines()}
      </table>
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
