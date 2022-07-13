import { Button, Paper, makeStyles } from '@material-ui/core';
import React, { useContext, useState } from 'react';
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
  const { data, answers, updateIdentification } = useIdentification(
    identificationConfiguration,
    identification
  );

  const [visibleAnswers, setVisibleAnswers] = useState(undefined);
  return (
    visible && (
      <div className={classes.row}>
        <Paper>
          {data?.map((question, index) => {
            return (
              <ClickableLine
                placeholder={question.label}
                key={`clikableLine-${index}`}
                value={question.selectedAnswer ? question.selectedAnswer.label : undefined}
                checked={question.selectedAnswer}
                onClickFunction={() => setVisibleAnswers(question.answers)}
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
        <Button
          onClick={() =>
            addNewState(
              {
                ...surveyUnit,
                identification: formatToSave(data),
              },
              surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type
            )
          }
        >
          Save
        </Button>
      </div>
    )
  );
};

export default Identification;
Identification.propTypes = {};
