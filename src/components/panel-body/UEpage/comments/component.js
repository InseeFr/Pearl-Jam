import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import Comment from './comment';
import './comments.scss';

const Comments = ({ saveUE }) => {
  const locationUrl = useHistory().location.pathname;
  const save = unite => {
    saveUE(unite, locationUrl);
  };
  return (
    <div className="Comments">
      <Comment editable saveUE={save} />
    </div>
  );
};

export default Comments;
Comments.propTypes = {
  saveUE: PropTypes.func.isRequired,
};
