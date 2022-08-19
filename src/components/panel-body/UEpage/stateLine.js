import React, { useContext } from 'react';
import { convertSUStateInToDo, getLastState } from 'utils/functions';

import InfoTile from './infoTile/infoTile';
import Navigation from './navigation';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import SurveyUnitContext from './UEContext';
import { makeStyles } from '@material-ui/core/styles';
import toDoEnum from 'utils/enum/SUToDoEnum';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    width: 'max-content',
    padding: 0,
    flex: '1',
  },
  row: {
    display: 'flex',
    alignItems: 'start',
    flex: '1',
  },
  background: {
    height: '5em',
    position: 'sticky',
    top: '5em',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: '2em',
    paddingRight: '2em',
    alignItems: 'flex-start',
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

  return (
    <div className={classes.background}>
      <InfoTile />
      <div className={classes.row}>
        <Stepper className={classes.root} activeStep={activeState - 1} alternativeLabel>
          {toDos.map(({ order, value }) => {
            return (
              <Step key={order}>
                <StepLabel>{value}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        <Navigation />
      </div>
    </div>
  );
};

export default StateLine;
StateLine.propTypes = {};
