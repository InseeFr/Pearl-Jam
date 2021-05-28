import { makeStyles, Paper, TextareaAutosize } from '@material-ui/core';
import { getCommentByType } from 'common-tools/functions/surveyUnitFunctions';
import D from 'i18n';
import PropTypes from 'prop-types';
import React, { useContext, useState } from 'react';
import SurveyUnitContext from '../../UEContext';

const useStyles = makeStyles(() => ({
  noResize: {
    resize: 'none',
    border: 'none',
    margin: '10px',
  },
  paper: {
    borderRadius: '15px',
    boxShadow: 'unset',
    border: 'LightGray solid 1px',
    marginTop: '1em',
    width: 'max-content',
  },
}));

const Comment = ({ editable, save }) => {
  const surveyUnit = useContext(SurveyUnitContext);
  const value = editable
    ? getCommentByType('INTERVIEWER', surveyUnit)
    : getCommentByType('MANAGEMENT', surveyUnit);
  const [interviewerComment, setInterviewerComment] = useState(value);

  const saveUE = comment => {
    const managementCommentValue = getCommentByType('MANAGEMENT', surveyUnit);
    const managementComment = { type: 'MANAGEMENT', value: managementCommentValue };
    const newInterviewerComment = { type: 'INTERVIEWER', value: comment };

    const newComments = [];
    newComments.push(managementComment);
    newComments.push(newInterviewerComment);
    surveyUnit.comments = newComments;
    save(surveyUnit);
  };

  const onChange = event => {
    setInterviewerComment(event.target.value);
    saveUE(event.target.value);
  };
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <TextareaAutosize
        className={classes.noResize}
        rowsMin={10}
        cols={50}
        placeholder={D.organizationComment}
        defaultValue={interviewerComment}
        onChange={onChange}
      />
    </Paper>
  );
};

export default Comment;
Comment.propTypes = {
  editable: PropTypes.bool.isRequired,
  save: PropTypes.func.isRequired,
};
