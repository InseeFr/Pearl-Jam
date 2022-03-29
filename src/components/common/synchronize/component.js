import React, { useContext } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import SyncIcon from 'utils/icons/SyncIcon';
import PropTypes from 'prop-types';
import { AppContext } from 'Root';
import D from 'i18n';
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
    <Tooltip title={D.synchronizeButton}>
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
    </Tooltip>
  );
};

export default Synchronize;
Synchronize.propTypes = {
  materialClass: PropTypes.string.isRequired,
};
