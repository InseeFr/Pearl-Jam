import React, { useContext, useState } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import D from 'i18n';
import { getCommentByType } from 'common-tools/functions/surveyUnitFunctions';
import SurveyUnitContext from '../../UEContext';
import Form from './form';
import './comment.scss';

const Comment = ({ saveUE, editable }) => {
  const ue = useContext(SurveyUnitContext);
  const [modalIsOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
  };
  const save = surveyUnit => {
    saveUE(surveyUnit);
    closeModal();
  };
  const value = editable ? getCommentByType('INTERVIEWER', ue) : getCommentByType('MANAGEMENT', ue);

  return (
    <div className="Comment">
      <div className="border">
        <div className="text" data-placeholder={D.organizationComment}>
          {value}
        </div>
      </div>

      {editable === true && (
        <button type="button" onClick={openModal}>
          <i className="fa fa-pencil" aria-hidden="true" />
          &nbsp;
          {D.editButton}
        </button>
      )}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal">
        <Form closeModal={closeModal} surveyUnit={ue} saveUE={save} />
      </Modal>
    </div>
  );
};

export default Comment;
Comment.propTypes = {
  editable: PropTypes.bool.isRequired,
  saveUE: PropTypes.func.isRequired,
};
