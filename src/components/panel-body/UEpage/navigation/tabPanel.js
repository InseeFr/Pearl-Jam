import PropTypes from 'prop-types';
import React from 'react';

const TabPanel = ({ children, hidden, ...other }) => {
  return (
    <div role="tabpanel" hidden={hidden} {...other}>
      {!hidden && { children }}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  hidden: PropTypes.bool.isRequired,
};

export default TabPanel;
