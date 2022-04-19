import React from 'react';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import Fab from '@material-ui/core/Fab';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { makeStyles } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
  column: {
    display: 'flex',
    flexDirection: 'column',
    '&[hidden]': { display: 'none' },
    padding: '1em',
    margin: '1em',
    height: 'max-content',
    borderRadius: '15px',
    minHeight: '200px',
    minWidth: '300px',
    width: 'max-content',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  top: { marginBottom: '1em' },
}));

const FormPanel = ({
  title,
  hidden,
  children,
  backFunction,
  actionFunction,
  actionLabel,
  actionDisabled,
}) => {
  const classes = useStyles();

  const actions = backFunction !== undefined || actionFunction !== undefined;

  return (
    <Paper className={classes.column} hidden={hidden}>
      <Typography variant="h6" className={classes.top}>
        {title}
      </Typography>
      {children}
      {actions && (
        <div className={classes.row}>
          {backFunction !== undefined && (
            <Fab color="primary" aria-label="add" onClick={backFunction}>
              <ChevronLeftIcon fontSize="large" />
            </Fab>
          )}
          {actionFunction !== undefined && (
            <DialogActions>
              <Button type="button" onClick={actionFunction} disabled={actionDisabled}>
                {actionLabel}
              </Button>
            </DialogActions>
          )}
        </div>
      )}
    </Paper>
  );
};

export default FormPanel;
FormPanel.propTypes = {
  title: PropTypes.string.isRequired,
  actionLabel: PropTypes.string,
  backFunction: PropTypes.func,
  actionFunction: PropTypes.func,
  hidden: PropTypes.bool,
  actionDisabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
};
FormPanel.defaultProps = {
  actionLabel: undefined,
  backFunction: undefined,
  actionFunction: undefined,
  hidden: false,
  actionDisabled: false,
};
