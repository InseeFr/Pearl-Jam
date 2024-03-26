import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Typography } from '../Typography';
import D from 'i18n';
import { Row } from '../Row';
import Stack from '@mui/material/Stack';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import { ButtonLine } from '../ButtonLine';
import { useIdentificationQuestions } from '../../utils/hooks/useIdentificationQuestions';

import DialogTitle from '@mui/material/DialogTitle';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import React, { useState } from 'react';
import { RadioLine } from '../RadioLine';
import RadioGroup from '@mui/material/RadioGroup';
import { surveyUnitIDBService } from '../../utils/indexeddb/services/surveyUnit-idb-service';
import { identificationConfigurationEnum } from '../../utils/enum/IdentificationConfigurationEnum';
import Box from '@mui/material/Box';

/**
 * @param {SurveyUnit} surveyUnit
 */
export function IdentificationCard({ surveyUnit }) {
  const { questions, setQuestion, answers, question, setAnswer } =
    useIdentificationQuestions(surveyUnit);
  return (
    <>
      <Card p={2} elevation={0}>
        <CardContent>
          <Stack gap={3}>
            <Row gap={1}>
              <AssignmentIndOutlinedIcon fontSize="large" />
              <Typography as="h2" variant="xl" fontWeight={700}>
                {D.identification}
              </Typography>
            </Row>
            <Stack gap={1}>
              {questions.map((question, k) => (
                <ButtonLine
                  key={question.type}
                  label={question.answer?.label ?? question.value}
                  checked={!!question.answer}
                  disabled={question.disabled}
                  onClick={() => setQuestion(question)}
                />
              ))}
              {surveyUnit.identificationConfiguration ===
                identificationConfigurationEnum.NOIDENT && (
                <Box typography="s" color="textTertiary">
                  {D.noLocation}
                </Box>
              )}
              {surveyUnit.identificationConfiguration === identificationConfigurationEnum.TEL && (
                <MoveQuestion surveyUnit={surveyUnit} />
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>
      <IdentificationDialog
        // We want a new state for each question
        key={question}
        answers={answers}
        question={question}
        onSubmit={setAnswer}
        onClose={() => setQuestion(undefined)}
      />
    </>
  );
}

/**
 * @param {SurveyUnit} surveyUnit
 */
function MoveQuestion({ surveyUnit }) {
  const options = [
    { label: D.yes, value: true },
    { label: D.no, value: false },
  ];
  const value = surveyUnit.move;
  const handleChange = e => {
    surveyUnitIDBService.addOrUpdateSU({
      ...surveyUnit,
      move: e.target.checked ? e.target.value === 'true' : null,
    });
  };
  return (
    <Row gap={2} mt={1}>
      <Typography as="legend" color="textTertiary" variant="s">
        {D.move}
      </Typography>
      <FormGroup row>
        {options.map(option => (
          <FormControlLabel
            key={option.label}
            sx={{ gap: 0 }}
            control={
              <Checkbox
                size="small"
                value={option.value}
                checked={value === option.value}
                onChange={handleChange}
              />
            }
            label={option.label}
          />
        ))}
      </FormGroup>
    </Row>
  );
}

function IdentificationDialog({ answers, question, onClose, onSubmit }) {
  const [localAnswer, setLocalAnswer] = useState(question?.answer?.value);

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(answers.find(a => a.value === localAnswer));
  };

  const handleChange = (e, v) => {
    setLocalAnswer(v);
  };

  return (
    <Dialog maxWidth="sm" open={answers.length > 0} onClose={onClose}>
      <form action="" onSubmit={handleSubmit}>
        <DialogTitle id="identification-title">{question?.value}</DialogTitle>
        <DialogContent>
          <RadioGroup
            onChange={handleChange}
            value={localAnswer}
            aria-labelledby="identification-title"
            name="identification-radio-group"
          >
            <Stack gap={1}>
              {answers.map(answer => (
                <RadioLine value={answer.value} key={answer.value} label={answer.label} />
              ))}
            </Stack>
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button type="button" color="white" variant="contained" onClick={onClose}>
            {D.cancelButton}
          </Button>
          <Button variant="contained" type="submit" disabled={!localAnswer}>
            {D.confirmButton}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
