import { makeStyles } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import SyncIcon from 'utils/icons/SyncIcon';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { AppContext } from 'Root';
import { SynchronizeWrapperContext } from 'components/sychronizeWrapper';

const useStyles = makeStyles(theme => ({
  dialogPaper: {
    padding: '1em',
    borderRadius: '15px',
    textAlign: 'center',
  },
  noVisibleFocus: {
    '&:focus, &:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
}));

const Synchronize = ({ materialClass }) => {
  const { online } = useContext(AppContext);
  const { syncFunction } = useContext(SynchronizeWrapperContext);

  const classes = useStyles();

  return (
    <IconButton
      classes={{
        root: classes.noVisibleFocus,
      }}
      edge="end"
      disabled={!online}
      aria-label="launch synchronization"
      onClick={syncFunction}
    >
      <SyncIcon className={materialClass} />
    </IconButton>
  );
};

export default Synchronize;
Synchronize.propTypes = {
  materialClass: PropTypes.string.isRequired,
};
