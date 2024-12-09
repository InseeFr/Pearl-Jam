import { Typography } from '../Typography';
import D from 'i18n';
import { Row } from '../Row';
import Stack from '@mui/material/Stack';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { RadioLine } from '../RadioLine';
import RadioGroup from '@mui/material/RadioGroup';
import { SurveyUnit } from 'types/pearl';
import {
  IdentificationQuestionOption,
  IdentificationQuestion,
  questions,
  hasDependency,
} from '../../utils/functions/identifications/identificationQuestionsByTelephone';
import { Card, CardContent } from '@mui/material';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import { ButtonLine } from 'ui/ButtonLine';
import { surveyUnitStateEnum } from 'utils/enum/SUStateEnum';
import { addNewState, persistSurveyUnit } from 'utils/functions/surveyUnitFunctions';

type ResponseState = { [key: string]: IdentificationQuestionOption | undefined };

interface IdentificationCardProps {
  surveyUnit: SurveyUnit;
}

export function IdentificationByTelCard({ surveyUnit }: Readonly<IdentificationCardProps>) {
  const [responses, setResponses] = useState<ResponseState>({});
  const [availableQuestions, setAvailableQuestions] = useState<{ [key: string]: boolean }>({});
  const [selectedDialogId, setSelectedDialogId] = useState<string | null>(null);

  useState(() => {
    const initialAvailability: { [key: string]: boolean } = questions.reduce(
      (acc, question) => ({ ...acc, [question.id]: true }),
      {}
    );
    setAvailableQuestions(initialAvailability);
  });

  const handleResponse = (questionId: string, option: IdentificationQuestionOption) => {
    setResponses(prev => {
      const updatedResponses = { ...prev, [questionId]: option };

      const updatedAvailability = questions.reduce(
        (acc, question) => {
          acc[question.id] = hasDependency(
            question,
            updatedResponses[question.dependsOn?.questionId as keyof ResponseState]
          );
          return acc;
        },
        {} as { [key: string]: boolean }
      );

      setAvailableQuestions(updatedAvailability);

      // Persist state if concluding question is answered
      if (questions.find(q => q.id === questionId && q.concluding)) {
        const newStates = addNewState(surveyUnit, surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type);
        persistSurveyUnit({ ...surveyUnit, states: newStates });
      }

      return updatedResponses;
    });
  };

  return (
    <>
      <Card elevation={0}>
        <CardContent>
          <Stack gap={3}>
            <Row gap={1}>
              <AssignmentIndOutlinedIcon fontSize="large" />
              <Typography as="h2" variant="xl" fontWeight={700}>
                {D.identification}
              </Typography>
            </Row>
            <Stack gap={1}>
              {questions.map(question => (
                <>
                  {
                    <ButtonLine
                      key={question.id}
                      onClick={() => setSelectedDialogId(question.id)}
                      label={responses[question.id] ? responses[question.id]?.label : question.text}
                      checked={
                        responses[question.id] && availableQuestions[question.id] ? true : false
                      }
                      disabled={!availableQuestions[question.id]}
                    ></ButtonLine>
                  }
                  {selectedDialogId == question.id && (
                    <IdentificationDialog
                      key={'question'}
                      question={question}
                      defaultOption={responses[question.id] ?? question.options[0]}
                      onSubmit={handleResponse}
                      onClose={() => setSelectedDialogId(null)}
                    />
                  )}
                </>
              ))}
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}

interface IdentificationDialogProps {
  question: IdentificationQuestion;
  defaultOption: IdentificationQuestionOption;
  onClose: () => void;
  onSubmit: (questionId: string, option: IdentificationQuestionOption) => void;
}

function IdentificationDialog({
  question,
  defaultOption,
  onClose,
  onSubmit,
}: Readonly<IdentificationDialogProps>) {
  const options = question.options;
  const [selectedOption, setSelectedOption] = useState(defaultOption);

  const handleChange = (newOption: IdentificationQuestionOption) => {
    setSelectedOption(newOption);
  };

  return (
    <Dialog maxWidth="sm" open={question.text.length > 0} onClose={onClose}>
      <DialogTitle id="identification-title">{question.text}</DialogTitle>
      <DialogContent>
        <RadioGroup
          onChange={e =>
            handleChange({
              value: e.target.value,
              label: options.find(o => o.value === e.target.value)?.label,
            })
          }
          value={selectedOption.value}
          aria-labelledby="identification-title"
          name="identification-radio-group"
        >
          <Stack gap={1}>
            {options.map((option: IdentificationQuestionOption) => (
              <RadioLine
                value={option.value}
                key={option.value}
                label={option.label}
                disabled={false}
              />
            ))}
          </Stack>
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button type="button" color="primary" variant="contained" onClick={onClose}>
          {D.cancelButton}
        </Button>
        <Button
          variant="contained"
          type="button"
          disabled={!selectedOption}
          onClick={() => {
            onClose(), onSubmit(question.id, selectedOption);
          }}
        >
          {D.confirmButton}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
