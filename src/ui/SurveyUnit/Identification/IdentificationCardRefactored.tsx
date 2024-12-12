import { Typography } from '../../Typography';
import D from 'i18n';
import { Row } from '../../Row';
import Stack from '@mui/material/Stack';
import { SurveyUnit } from 'types/pearl';
import { Card, CardContent } from '@mui/material';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import { ButtonLine } from 'ui/ButtonLine';
import {
  IdentificationConfiguration,
  IdentificationQuestionsId,
} from 'utils/enum/identifications/IdentificationsQuestionsRefactored';
import { useIdentification } from 'utils/hooks/useIdentificationQuestionsRefactored';
import { IdentificationDialog } from './IdentificationDialog';

type IdentificationCardProps = {
  surveyUnit: SurveyUnit;
};

export function IdentificationByTelCard({ surveyUnit }: Readonly<IdentificationCardProps>) {
  const {
    questions,
    responses,
    selectedDialogId,
    availableQuestions,
    setSelectedDialogId,
    handleResponse,
  } = useIdentification(surveyUnit);

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
              {(Object.keys(questions) as IdentificationQuestionsId[]).map(questionId => (
                <>
                  <ButtonLine
                    key={questionId}
                    onClick={() => setSelectedDialogId(questionId)}
                    label={responses[questionId]?.label ?? questions[questionId]?.text}
                    checked={responses[questionId] && availableQuestions[questionId] ? true : false}
                    disabled={!availableQuestions[questionId]}
                  ></ButtonLine>

                  {selectedDialogId === questionId && (
                    <IdentificationDialog
                      questionId={questionId}
                      key={`dialog-${questionId}`}
                      question={questions[questionId]}
                      defaultOption={responses[questionId] ?? questions[questionId]?.options[0]}
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
