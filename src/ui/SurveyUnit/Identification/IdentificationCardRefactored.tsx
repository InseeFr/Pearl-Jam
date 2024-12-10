import { Typography } from '../../Typography';
import D from 'i18n';
import { Row } from '../../Row';
import Stack from '@mui/material/Stack';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { RadioLine } from '../../RadioLine';
import RadioGroup from '@mui/material/RadioGroup';
import { SurveyUnit } from 'types/pearl';
import {
  IdentificationQuestionValue,
  IdentificationQuestionValueOption,
  questions,
} from '../../../utils/functions/identifications/identificationFunctionsRefactored';
import { Card, CardContent } from '@mui/material';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import { ButtonLine } from 'ui/ButtonLine';
import { IdentificationQuestionsId } from 'utils/enum/identifications/IdentificationsQuestionsRefactored';
import { useIdentification } from 'utils/hooks/useIdentificationQuestions2';
import { IdentificationDialog } from './IdentificationDialog';

interface IdentificationCardProps {
  surveyUnit: SurveyUnit;
}

export function IdentificationByTelCard({ surveyUnit }: Readonly<IdentificationCardProps>) {
  const { responses, selectedDialogId, availableQuestions, setSelectedDialogId, handleResponse } =
    useIdentification(surveyUnit);

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
              {(Object.keys(questions) as unknown as IdentificationQuestionsId[]).map(
                questionId => (
                  <>
                    <ButtonLine
                      key={questionId}
                      onClick={() => setSelectedDialogId(questionId)}
                      label={responses[questionId]?.label ?? questions[questionId].text}
                      checked={
                        responses[questionId] && availableQuestions[questionId] ? true : false
                      }
                      disabled={!availableQuestions[questionId]}
                    ></ButtonLine>

                    {selectedDialogId === questionId && (
                      <IdentificationDialog
                        questionId={questionId}
                        key={`dialog-${questionId}`}
                        question={questions[questionId]}
                        defaultOption={responses[questionId] ?? questions[questionId].options[0]}
                        onSubmit={handleResponse}
                        onClose={() => setSelectedDialogId(null)}
                      />
                    )}
                  </>
                )
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
