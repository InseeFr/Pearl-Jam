import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import D from 'i18n';
import contactAttemptDBService from 'indexedbb/services/contactAttempt-idb-service';
import format from 'date-fns/format';
import Form from './form';
import SurveyUnitContext from '../../UEContext';

const ContactAttempts = ({ saveUE }) => {
  const ue = useContext(SurveyUnitContext);
  const [contactAttempt, setContactAttempt] = useState({ status: 'titi', date: 12345 });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [contactAttempts, setcontactAttempts] = useState([]);

  useEffect(() => {
    const getContactAttempts = async ids => {
      if (ids === undefined || ids.length === 0) return [];
      const cat = await contactAttemptDBService.findByIds(ids);
      return cat;
    };

    if (ue !== undefined) {
      const contactAttemptsId = ue.contactAttempts;
      getContactAttempts(contactAttemptsId).then(cA => setcontactAttempts(cA));
    }
  }, [ue]);

  const lines = () => {
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
    return (
      <tr>
        <td />
        <td>{D.noContactAttempt}</td>
      </tr>
    );
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
        <tbody>{lines()}</tbody>
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
