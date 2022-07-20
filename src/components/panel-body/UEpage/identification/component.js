import { Button, Paper, makeStyles } from '@material-ui/core';
import React, { useContext } from 'react';
import { formatToSave, useIdentification } from 'utils/functions/identificationFunctions';

import ClickableLine from './clickableLine';
import LabelledCheckbox from './labelledCheckbox';
import SurveyUnitContext from '../UEContext';
import { addNewState } from 'utils/functions';
import { identificationConfigurationEnum } from 'utils/enum/IdentificationConfigurationEnum';
import { surveyUnitStateEnum } from 'utils/enum/SUStateEnum';

const useStyles = makeStyles(() => ({
  row: {
    display: 'flex',
    borderRadius: '15px',
  },
}));

const Identification = () => {
  const { surveyUnit } = useContext(SurveyUnitContext);
  const { identification, identificationConfiguration } = surveyUnit;
  const classes = useStyles();
  const visible = identificationConfiguration === identificationConfigurationEnum.IASCO;
  const {
    data,
    answers,
    visibleAnswers,
    setVisibleAnswers,
    updateIdentification,
  } = useIdentification(identificationConfiguration, identification);

  const saveIdentification = () =>
    addNewState(
      {
        ...surveyUnit,
        identification: formatToSave(data),
      },
      surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type
    );

  return (
    visible && (
      <div className={classes.row}>
        <Paper>
          {data?.map(question => {
            return (
              <ClickableLine
                placeholder={question.label}
                value={question.selectedAnswer ? question.selectedAnswer.label : undefined}
                checked={question.selectedAnswer}
                selected={question.selected}
                disabled={question.disabled}
                onClickFunction={() => {
                  if (!question.disabled) {
                    setVisibleAnswers(question.answers);
                  }
                }}
              />
            );
          })}
        </Paper>
        <Paper>
          {visibleAnswers?.map(answer => {
            return (
              <LabelledCheckbox
                value={answer.label}
                checked={
                  answers.filter(
                    currentAnswer => currentAnswer && currentAnswer.type === answer.type
                  ).length > 0
                }
                onClickFunction={() => updateIdentification(answer)}
              />
            );
          })}
        </Paper>
        <Button onClick={saveIdentification}>Save</Button>
      </div>
    )
  );
};

export default Identification;
Identification.propTypes = {};
