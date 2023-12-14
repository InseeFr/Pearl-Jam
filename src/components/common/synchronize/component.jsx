import React, { useContext } from 'react';

import D from 'i18n';
import IconButton from '@material-ui/core/IconButton';
import LoopIcon from '@material-ui/icons/Loop';
import PropTypes from 'prop-types';
import { SynchronizeWrapperContext } from 'components/sychronizeWrapper';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { useNetworkOnline } from '../../../utils/hooks/useOnline';

const useStyles = makeStyles(theme => ({
  noVisibleFocus: {
    border: '1px solid #e2e2e1',
    borderRadius: '0.2em',
    backgroundColor: 'white',
    height: '1em',
    marginRight: '60px',
    alignSelf: 'center',
    '&:focus, &:hover': {
      backgroundColor: 'lightgrey',
    },
  },
  marginTypo: {
    marginLeft: '0.5em',
  },
}));

const Synchronize = ({ materialClass }) => {
  const online = useNetworkOnline();
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
        <LoopIcon type="sync" />
        <Typography variant="subtitle2" className={classes.marginTypo}>
          Synchroniser
        </Typography>
      </IconButton>
    </Tooltip>
  );
};

export default Synchronize;
Synchronize.propTypes = {
  materialClass: PropTypes.string.isRequired,
};
