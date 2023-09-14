import React, { useContext } from 'react';

import { AppContext } from 'Root';
import D from 'i18n';
import IconButton from '@material-ui/core/IconButton';
import MaterialIcons from 'utils/icons/materialIcons';
import PropTypes from 'prop-types';
import { SynchronizeWrapperContext } from 'components/sychronizeWrapper';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
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
    <Tooltip className={classes.noVisibleFocus} title={D.synchronizeButton}>
      <IconButton
        classes={{
          root: classes.noVisibleFocus,
        }}
        edge="end"
        disabled={!online}
        aria-label="launch synchronization"
        onClick={syncFunction}
      >
        <MaterialIcons type="sync" />
      </IconButton>
    </Tooltip>
  );
};

export default Synchronize;
Synchronize.propTypes = {
  materialClass: PropTypes.string.isRequired,
};
