import { Typography } from '../../Typography';
import D from 'i18n';
import { Row } from '../../Row';
import Stack from '@mui/material/Stack';
import { SurveyUnit } from 'types/pearl';
import { Card, CardContent, Checkbox, FormControlLabel } from '@mui/material';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import { ButtonLine } from 'ui/ButtonLine';
import { IdentificationQuestionsId } from 'utils/enum/identifications/IdentificationsQuestions';
import { useIdentificationQuestions } from 'utils/hooks/useIdentificationQuestions';
import { IdentificationDialog } from './IdentificationDialog';
import { IdentificationQuestionValue } from 'utils/functions/identifications/identificationFunctions';

type IdentificationCardProps = {
  surveyUnit: SurveyUnit;
};

export function IdentificationCard({ surveyUnit }: Readonly<IdentificationCardProps>) {
  const {
    questions,
    responses,
    selectedDialogId,
    availableQuestions,
    setSelectedDialogId,
    handleResponseCallback,
    handleCheckboxChange,
  } = useIdentificationQuestions(surveyUnit);

  const isDemenagementWeb = surveyUnit.identification?.demenagementWeb === true;

  const renderCheckboxQuestion = (
    questionId: IdentificationQuestionsId,
    question: IdentificationQuestionValue
  ) => {
    const isChecked = responses[questionId]?.value === true;
    const isAvailable = availableQuestions[questionId];

    // Don't display checkbox when demenagementWeb is true (except for demenagementWeb itself)
    if (isDemenagementWeb && questionId !== IdentificationQuestionsId.DEMENAGEMENT_WEB) {
      return null;
    }

    if (!isAvailable && !isChecked) return null;

    return (
      <FormControlLabel
        key={questionId}
        control={
          <Checkbox
            checked={isChecked}
            disabled={question.readOnly || !isAvailable}
            onChange={e => handleCheckboxChange(questionId, e.target.checked)}
            sx={{
              color: 'success.main',
              '&.Mui-checked': {
                color: 'success.main',
              },
            }}
          />
        }
        label={
          <Typography variant="s" fontWeight={600}>
            {question.text}
          </Typography>
        }
        sx={{
          bgcolor: 'surfacePrimary.light',
          borderRadius: 4,
          px: 2,
          py: 0.5,
          mx: 0,
        }}
      />
    );
  };

  const renderRadioQuestion = (questionId: IdentificationQuestionsId) => (
    <ButtonLine
      key={questionId}
      onClick={() => setSelectedDialogId(questionId)}
      label={responses[questionId]?.label ?? questions?.values[questionId]?.text}
      checked={!!(responses[questionId] && availableQuestions[questionId])}
      disabled={!availableQuestions[questionId]}
    />
  );

  return (
    <Card elevation={0}>
      <CardContent>
        <Stack gap={3}>
          <Row gap={1}>
            <AssignmentIndOutlinedIcon fontSize="large" />
            <Typography component="h2" variant="xl" fontWeight={700}>
              {D.identification}
            </Typography>
          </Row>
          <Stack gap={1}>
            {isDemenagementWeb && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked
                    disabled
                    sx={{
                      color: 'success.main',
                      '&.Mui-checked': {
                        color: 'success.main',
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="s" fontWeight={600}>
                    {D.moveDeclaredOnWeb}
                  </Typography>
                }
                sx={{
                  bgcolor: 'surfacePrimary.light',
                  borderRadius: 4,
                  px: 2,
                  py: 0.5,
                  mx: 0,
                }}
              />
            )}
            {(Object.keys(questions.values) as IdentificationQuestionsId[]).map(questionId => {
              const question = questions.values[questionId];
              if (!question) return null;

              if (question.type === 'checkbox') {
                return renderCheckboxQuestion(questionId, question);
              }
              return renderRadioQuestion(questionId);
            })}
          </Stack>
        </Stack>
      </CardContent>
      {selectedDialogId && (
        <IdentificationDialog
          questionId={selectedDialogId}
          key={`dialog-${selectedDialogId}`}
          question={questions.values[selectedDialogId]}
          defaultOption={responses[selectedDialogId] ?? undefined}
          onSubmit={handleResponseCallback}
          onClose={() => {
            setSelectedDialogId(undefined);
          }}
        />
      )}
    </Card>
  );
}
