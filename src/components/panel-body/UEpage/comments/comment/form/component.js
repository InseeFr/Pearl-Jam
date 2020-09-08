import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { getCommentByType } from 'common-tools/functions';
import './form.scss';
import D from 'i18n';

const Form = ({ closeModal, surveyUnit, saveUE }) => {
  const [interviewerComment, setInterviewerComment] = useState(
    getCommentByType('INTERVIEWER', surveyUnit)
  );

  const onChange = event => {
    setInterviewerComment(event.target.value);
  };

  const save = () => {
    const managementCommentValue = getCommentByType('MANAGEMENT', surveyUnit);
    const managementComment = { type: 'MANAGEMENT', value: managementCommentValue };
    const newInterviewerComment = { type: 'INTERVIEWER', value: interviewerComment };

    const newComments = [];
    newComments.push(managementComment);
    newComments.push(newInterviewerComment);
    surveyUnit.comments = newComments;
    saveUE(surveyUnit);
  };

  return (
    <div className="form">
      <label htmlFor="comment">
        <p className="title">{D.organizationComment}</p>
        <textarea
          autoFocus
          type="textarea"
          id="comment"
          name="comment"
          rows="10"
          cols="100"
          defaultValue={interviewerComment}
          onChange={onChange}
        />
      </label>
      <div className="buttonsGroup">
        <button type="button" onClick={closeModal}>
          <i className="fa fa-times" aria-hidden="true" />
          &nbsp;
          {D.cancelButton}
        </button>
        <button type="button" onClick={save}>
          <i className="fa fa-check" aria-hidden="true" />
          &nbsp;
          {D.saveButton}
        </button>
      </div>
    </div>
  );
};

export default Form;
Form.propTypes = {
  surveyUnit: PropTypes.object,
  saveUE: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
};
