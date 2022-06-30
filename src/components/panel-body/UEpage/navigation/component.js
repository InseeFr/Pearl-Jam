import React, { useContext } from 'react';
import { addNewState, isQuestionnaireAvailable, isValidForTransmission } from 'utils/functions';
import { useHistory, useParams } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import D from 'i18n';
import PropTypes from 'prop-types';
import SurveyUnitContext from '../UEContext';
import Tooltip from '@material-ui/core/Tooltip';
import WarningIcon from '@material-ui/icons/Warning';
import { makeStyles } from '@material-ui/core/styles';
import { surveyUnitStateEnum } from 'utils/enum/SUStateEnum';

const useStyles = makeStyles(theme => ({
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'sticky',
    top: '10.5em',
    backgroundColor: 'white',
    borderBottom: '1px solid gray',
    height: '3em',
    boxSizing: 'unset',
  },
  button: {
    backgroundColor: theme.palette.primary.darker,
    color: 'white',
    marginRight: '1em',
  },
}));

const Navigation = () => {
  const { surveyUnit, inaccessible } = useContext(SurveyUnitContext);
  const history = useHistory();
  const { id } = useParams();

  const openQueen = () => {
    history.push(`/queen/survey-unit/${id}`);
  };

  const transmit = async () => {
    const newType = surveyUnitStateEnum.WAITING_FOR_SYNCHRONIZATION.type;
    await addNewState(surveyUnit, newType);
    // history.push(match.url);
  };
  const transmissionValidity = isValidForTransmission(surveyUnit);

  const classes = useStyles();

  return (
    <div className={classes.row}>
      <div>
        <Button
          className={classes.button}
          disabled={!isQuestionnaireAvailable(surveyUnit)(inaccessible)}
          onClick={openQueen}
          endIcon={inaccessible && <WarningIcon style={{ color: 'orange' }} />}
        >
          {D.questionnaireButton}
        </Button>
        <Tooltip title={transmissionValidity ? '' : D.transmissionInvalid}>
          <span>
            <Button disabled={!transmissionValidity} className={classes.button} onClick={transmit}>
              {D.sendButton}
            </Button>
          </span>
        </Tooltip>
      </div>
    </div>
  );
};

export default Navigation;
Navigation.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
};
