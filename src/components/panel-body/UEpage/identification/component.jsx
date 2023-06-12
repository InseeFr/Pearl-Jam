import React, { useContext, useRef } from 'react';
import { formatToSave, useIdentification } from 'utils/functions/identificationFunctions';

import ClickableLine from './clickableLine';
import LabelledCheckbox from './labelledCheckbox';
import Paper from '@material-ui/core/Paper';
import SurveyUnitContext from '../UEContext';
import { addNewState } from 'utils/functions';
import { makeStyles } from '@material-ui/core';
import { surveyUnitStateEnum } from 'utils/enum/SUStateEnum';

const useStyles = makeStyles(() => ({
  row: {
    display: 'flex',
    borderRadius: '15px',
    gap: '1em',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5em',
  },
}));

const Identification = () => {
  const { surveyUnit } = useContext(SurveyUnitContext);
  const { identification, identificationConfiguration } = surveyUnit;
  const classes = useStyles();
  const {
    data,
    answers,
    visibleAnswers,
    setVisibleAnswers,
    updateIdentification,
  } = useIdentification(identificationConfiguration, identification);
  const selectedQuestion = useRef(data?.filter(question => question.selected)?.[0]);
  const setSelectedQuestion = value => {
    selectedQuestion.current = value;
  };

  const saveIdentification = identificationData =>
    addNewState(
      {
        ...surveyUnit,
        identification: formatToSave(identificationData),
      },
      surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type
    );

  return (
    <div className={classes.row}>
      <Paper className={classes.column} elevation={0}>
        {data?.map(question => {
          return (
            <ClickableLine
              placeholder={question.label}
              value={question.selectedAnswer ? question.selectedAnswer.label : undefined}
              checked={question.selectedAnswer}
              selected={
                (!selectedQuestion.current && question.selected) ||
                question.label === selectedQuestion?.current?.label
              }
              disabled={question.disabled}
              onClickFunction={() => {
                if (!question.disabled) {
                  setSelectedQuestion(question);
                  setVisibleAnswers(question.answers);
                }
              }}
            />
          );
        })}
      </Paper>
      <Paper elevation={0}>
        {visibleAnswers?.map(answer => {
          return (
            <LabelledCheckbox
              value={answer.label}
              checked={
                answers.filter(currentAnswer => currentAnswer && currentAnswer.type === answer.type)
                  .length > 0
              }
              onClickFunction={() => {
                const newData = updateIdentification(answer);
                saveIdentification(newData);
              }}
            />
          );
        })}
      </Paper>
    </div>
  );
};

export default Identification;
Identification.propTypes = {};
