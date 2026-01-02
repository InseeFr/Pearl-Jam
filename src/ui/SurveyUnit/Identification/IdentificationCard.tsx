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
import { persistSurveyUnit } from 'utils/functions';
import { surveyUnitStateEnum } from 'utils/enum/SUStateEnum';

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
  } = useIdentificationQuestions(surveyUnit);

  const isDemenagementWeb = surveyUnit.identification?.demenagementWeb === 'true';
  const isDemenagementEnqueteur = surveyUnit.identification?.demenagementEnqueteur === 'true';

  const handleDemenagementEnqueteurChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    const newIdentification = {
      ...surveyUnit.identification,
      demenagementEnqueteur: isChecked ? 'true' : 'false',
    };

    const newStates = isChecked
      ? [{ type: surveyUnitStateEnum.QUESTIONNAIRE_STARTED.type, date: Date.now() }]
      : surveyUnit.states;

    const updatedSurveyUnit = {
      ...surveyUnit,
      identification: newIdentification,
      persons: isChecked
        ? [
            {
              title: '',
              firstName: D.surveyUnitFirstName,
              lastName: D.surveyUnitLastName,
              email: '',
              birthdate: 0,
              favoriteEmail: false,
              privileged: true,
              phoneNumbers: [],
            },
          ]
        : surveyUnit.persons,
      states: newStates,
      otherModeQuestionnaireState: isChecked ? [] : surveyUnit.otherModeQuestionnaireState,
    };

    persistSurveyUnit(updatedSurveyUnit);
  };

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
                    checked={isDemenagementWeb}
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
            {!isDemenagementWeb && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isDemenagementEnqueteur}
                    onChange={handleDemenagementEnqueteurChange}
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
                    {D.moveAllResidents}
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
            {(Object.keys(questions.values) as IdentificationQuestionsId[]).map(questionId => (
              <ButtonLine
                key={questionId}
                onClick={() => setSelectedDialogId(questionId)}
                label={responses[questionId]?.label ?? questions?.values[questionId]?.text}
                checked={!!(responses[questionId] && availableQuestions[questionId])}
                disabled={!availableQuestions[questionId]}
              ></ButtonLine>
            ))}
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
