import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Paper from '@material-ui/core/Paper';

import D from 'i18n';
import PropTypes from 'prop-types';
import SurveyUnitContext from '../../UEContext';
import { getCommentByType } from 'utils/functions/surveyUnitFunctions';
import surveyUnitIdbService from 'utils/indexeddb/services/surveyUnit-idb-service';

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

const Comment = ({ editable }) => {
  const { surveyUnit } = useContext(SurveyUnitContext);
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
    surveyUnitIdbService.addOrUpdate(surveyUnit);
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
        onBlur={onChange}
      />
    </Paper>
  );
};

export default Comment;
Comment.propTypes = {
  editable: PropTypes.bool.isRequired,
};
