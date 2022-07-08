import { Button, Paper, makeStyles } from '@material-ui/core';
import React, { useContext, useState } from 'react';
import { formatToSave, useIdentification } from 'utils/functions/identificationFunctions';

import ClickableLine from './clickableLine';
import LabelledCheckbox from './labelledCheckbox';
import SurveyUnitContext from '../UEContext';
import surveyUnitIdbService from 'utils/indexeddb/services/surveyUnit-idb-service';

const useStyles = makeStyles(() => ({
  row: {
    display: 'flex',
    borderRadius: '15px',
  },
}));

const Identification = ({ selectFormType, setInjectableData }) => {
  const { surveyUnit } = useContext(SurveyUnitContext);
  const { identification, identificationConfiguration } = surveyUnit;
  const classes = useStyles();

  const { data, answers, updateIdentification } = useIdentification(
    identificationConfiguration,
    identification
  );

  const [visibleAnswers, setVisibleAnswers] = useState(undefined);
  return (
    <div className={classes.row}>
      <Paper>
        {data &&
          data.map(question => {
            return (
              <>
                <ClickableLine
                  placeholder={question.label}
                  value={question.selectedAnswer ? question.selectedAnswer.label : undefined}
                  checked={question.selectedAnswer}
                  onClickFunction={() => setVisibleAnswers(question.answers)}
                />
              </>
            );
          })}
      </Paper>
      <Paper>
        {visibleAnswers &&
          visibleAnswers.map(answer => {
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
          surveyUnitIdbService.addOrUpdateSU({
            ...surveyUnit,
            identification: formatToSave(data),
          })
        }
      >
        Save
      </Button>
    </div>
  );
};

export default Identification;
Identification.propTypes = {};
