import React, { useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import D from 'i18n';
import SurveyUnitContext from '../UEContext';
import WarningIcon from '@material-ui/icons/Warning';
import { isQuestionnaireAvailable } from 'utils/functions';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  button: {
    backgroundColor: theme.palette.primary.darker,
    color: 'white',
    marginRight: '1em',
  },
}));

const Questionnaires = () => {
  const { surveyUnit, inaccessible } = useContext(SurveyUnitContext);
  const history = useHistory();
  const { id } = useParams();
  const openQueen = () => {
    history.push(`/queen/survey-unit/${id}`);
  };

  const classes = useStyles();

  return (
    <Button
      className={classes.button}
      disabled={!isQuestionnaireAvailable(surveyUnit)(inaccessible)}
      onClick={openQueen}
      endIcon={inaccessible && <WarningIcon style={{ color: 'orange' }} />}
    >
      {' '}
      {D.questionnaireButton}
    </Button>
  );
};

export default Questionnaires;
