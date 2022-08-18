import React, { useContext } from 'react';
import { convertSUStateInToDo, getLastState } from 'utils/functions';

import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import Navigation from './navigation';
import PropTypes from 'prop-types';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import SurveyUnitContext from './UEContext';
import { makeStyles } from '@material-ui/core/styles';
import toDoEnum from 'utils/enum/SUToDoEnum';

const useStyles = makeStyles(theme => ({
  root: {
    width: '50%',
  },
  icon: {
    color: 'green',
  },
  background: {
    width: '100%',
    height: '5em',
    backgroundColor: theme.palette.primary.main,
    position: 'sticky',
    top: '5em',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
}));
const StateLine = () => {
  const { surveyUnit } = useContext(SurveyUnitContext);

  const state = getLastState(surveyUnit);
  const { type } = state;
  const currentState = convertSUStateInToDo(type);
  const { order: activeState } = currentState;

  const classes = useStyles();

  const toDos = Object.entries(toDoEnum)
    .map(([, v]) => v)
    .filter(toDo => toDo.order !== 7);

  const icons = {
    done: <CheckCircleOutlineIcon className={classes.icon} />,
    future: <RadioButtonUncheckedIcon className={classes.icon} />,
  };
  const StepIcon = props => {
    const { completed } = props;

    return <div>{completed ? icons.done : icons.future}</div>;
  };
  StepIcon.propTypes = {
    completed: PropTypes.bool.isRequired,
  };

  return (
    <div className={classes.background}>
      <Stepper className={classes.root} activeStep={activeState - 1}>
        {toDos.map(({ order, value }) => {
          const stepProps = {};
          if (order < activeState) {
            stepProps.completed = true;
          }
          return (
            <Step key={order} {...stepProps}>
              <StepLabel StepIconComponent={StepIcon}>{value}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <Navigation />
    </div>
  );
};

export default StateLine;
StateLine.propTypes = {};
