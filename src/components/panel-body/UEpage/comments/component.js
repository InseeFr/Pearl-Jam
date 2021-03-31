import PropTypes from 'prop-types';
import React from 'react';
import Comment from './comment';

const Comments = ({ save }) => {
  return <Comment editable save={save} />;
};

export default Comments;
Comments.propTypes = {
  save: PropTypes.func.isRequired,
};
