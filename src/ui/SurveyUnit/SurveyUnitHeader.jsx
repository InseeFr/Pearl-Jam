import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { Row } from '../Row';
import { PaperIconButton } from '../PaperIconButton';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { Link } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import { PrivilegedPerson } from './PrivilegedPerson';
import Chip from '@mui/material/Chip';
import React from 'react';
import { Typography } from '../Typography';
import { toDoEnum } from '../../utils/enum/SUToDoEnum';
import { addNewState, getSuTodoState, isValidForTransmission } from '../../utils/functions';
import CheckIcon from '@mui/icons-material/Check';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { surveyUnitStateEnum } from '../../utils/enum/SUStateEnum';

/**
 * @param {SurveyUnit} surveyUnit
 */
export function SurveyUnitHeader({ surveyUnit }) {
  const states = Object.values(toDoEnum).filter(toDo => toDo.order < 6);
  const currentState = getSuTodoState(surveyUnit).order;

  console.log(states, currentState);

  return (
    <Box
      px={4}
      py={2}
      sx={{ display: 'grid', gridTemplateColumns: '1fr 700px', alignItems: 'center' }}
      bgcolor="white.main"
    >
      {/* Left side */}
      <Row gap={4}>
        <PaperIconButton component={Link} to="/">
          <KeyboardArrowLeftIcon />
        </PaperIconButton>
        <Stack gap={2}>
          <Row gap={0.5}>
            <Chip
              label={surveyUnit.campaign.toLowerCase()}
              sx={{
                maxWidth: 200,
                overflow: 'hidden',
                textOverflow: 'ellispsis',
              }}
            />
            <Chip label={surveyUnit.sampleIdentifiers.ssech} />
            <Typography color="textPrimary" variant="s" noWrap>
              &nbsp; | 223-1111-75
            </Typography>
          </Row>
          <PrivilegedPerson surveyUnit={surveyUnit} />
        </Stack>
      </Row>

      {/* Right Side */}
      <Stepper activeStep={currentState - 1} alternativeLabel>
        {states.map(state => {
          return (
            <Step key={state.order}>
              <StepLabel StepIconComponent={StepIcon}>
                {state.order < currentState ? state.stepName : state.value}
              </StepLabel>
              {state.order === '4' && <SubmitButton surveyUnit={surveyUnit} />}
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
}

/**
 * Transmit button to sync a surveyUnit
 *
 * @param {SurveyUnit} surveyUnit
 * @returns {JSX.Element}
 * @constructor
 */
function SubmitButton({ surveyUnit }) {
  const canSubmit = isValidForTransmission(surveyUnit);
  const handleSubmit = async () => {
    await addNewState(surveyUnit, surveyUnitStateEnum.WAITING_FOR_SYNCHRONIZATION.type);
  };

  if (!canSubmit) {
    return null;
  }

  return (
    <Box position="relative">
      <Box position="absolute" sx={{ left: -20, top: -10 }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 31 44"
          width={31}
          height={44}
        >
          <path
            fill="#D7DBE1"
            d="m18.894 36.447.017-1-.017 1Zm11.52.901a1 1 0 0 0 .024-1.414l-6.256-6.47a1 1 0 1 0-1.437 1.39l5.56 5.752-5.75 5.56a1 1 0 1 0 1.39 1.439l6.47-6.257ZM20.157 1.001l-.016 1 .016-1ZM5.16 8.547l.813.582-.813-.582Zm-.18.25-.812-.582.813.582ZM2.67 24.684l.946-.327-.945.327Zm16.207 12.763 10.826.182.033-2-10.825-.181-.034 2ZM22.965.048 20.173.001l-.033 2 2.791.047.034-2ZM4.348 7.964l-.18.251L5.794 9.38l.18-.251-1.627-1.165ZM20.172.001A19.073 19.073 0 0 0 4.348 7.964L5.973 9.13A17.073 17.073 0 0 1 20.14 2.001l.033-2ZM1.726 25.011a18.476 18.476 0 0 0 17.151 12.436l.034-2a16.476 16.476 0 0 1-15.295-11.09l-1.89.653Zm1.89-.654A16.476 16.476 0 0 1 5.794 9.38L4.168 8.215A18.476 18.476 0 0 0 1.726 25.01l1.89-.653Z"
          />
        </svg>
      </Box>
      <Box position="absolute" sx={{ left: '50%', transform: 'translateX(-50%)' }}>
        <Button
          onClick={handleSubmit}
          color="surfaceSecondary"
          variant="contained"
          size="small"
          sx={{ width: 82, height: 30, margin: '10px auto 0 auto', display: 'flex' }}
        >
          <SendIcon fontSize="small" />
        </Button>
      </Box>
    </Box>
  );
}

/**
 * Custom icon for the stepper
 *
 * @param {boolean} completed
 * @param {boolean} active
 * @param {boolean} error
 * @param {string} icon
 */
function StepIcon({ completed, active, error, icon }) {
  if (completed) {
    return <CheckIcon fontSize="inherit" color="white" />;
  }
  return <>{icon}</>;
}
