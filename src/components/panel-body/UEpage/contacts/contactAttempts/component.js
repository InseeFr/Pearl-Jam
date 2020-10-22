import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import D from 'i18n';
import contactAttemptDBService from 'indexedbb/services/contactAttempt-idb-service';
import { deleteContactAttempt } from 'common-tools/functions';
import format from 'date-fns/format';
import { findContactAttemptValueByType } from 'common-tools/enum/ContactAttemptEnum';
import Form from './form';
import SurveyUnitContext from '../../UEContext';

const ContactAttempts = ({ saveUE }) => {
  const su = useContext(SurveyUnitContext);
  const [contactAttempt, setContactAttempt] = useState({ status: 'titi', date: 12345 });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [contactAttempts, setcontactAttempts] = useState([]);
  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    const getContactAttempts = async ids => {
      if (ids === undefined || ids.length === 0) return [];
      const cat = await contactAttemptDBService.findByIds(ids);
      cat.sort((a, b) => b.date - a.date);
      return cat;
    };

    if (su !== undefined) {
      const contactAttemptsId = su.contactAttempts;
      getContactAttempts(contactAttemptsId).then(cA => setcontactAttempts(cA));
      setRefresh(false);
    }
  }, [su, refresh]);

  const lines = () => {
    if (Array.isArray(contactAttempts) && contactAttempts.length > 0)
      return contactAttempts.map((contAtt, index) => {
        const date = format(new Date(contAtt.date), 'dd/MM/yyyy');
        const hour = format(new Date(contAtt.date), 'HH');
        const minutes = format(new Date(contAtt.date), 'mm');
        const isLastContact = index === 0;

        return (
          <tr className="line" key={contAtt.id}>
            <td>
              <button
                type="button"
                className="smallButton"
                hidden={isLastContact}
                onClick={() => {
                  deleteContactAttempt(su, contAtt.id);
                  setRefresh(true);
                }}
              >
                <i className="fa fa-times" aria-hidden="true" />
              </button>
            </td>
            <td>
              <div>
                {`${date} - ${hour}h${minutes} - ${D.telephone} - ${findContactAttemptValueByType(
                  contAtt.status
                )}`}
              </div>
            </td>
          </tr>
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
          surveyUnit={su}
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
