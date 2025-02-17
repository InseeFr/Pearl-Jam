import { useState, useEffect, ReactNode } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { Row } from '../Row';
import { PaperIconLink } from '../PaperIconButton';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { Link } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import { PrivilegedPerson } from './PrivilegedPerson';
import Chip from '@mui/material/Chip';
import { Typography } from '../Typography';
import { toDoEnum } from '../../utils/enum/SUToDoEnum';
import { getLastState, getSuTodoState } from '../../utils/functions';
import Button from '@mui/material/Button';
import { surveyUnitStateEnum } from '../../utils/enum/SUStateEnum';
import { Popover, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import FiberManualRecordOutlinedIcon from '@mui/icons-material/FiberManualRecordOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useIdentificationQuestions } from '../../utils/hooks/useIdentificationQuestions';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import D from '../../i18n/build-dictionary';
import { SurveyUnit } from 'types/pearl';
import { SubmitButton } from './SubmitButton';
import CheckIcon from '@mui/icons-material/Check';

const useStyles = makeStyles({
  rotateBox: {
    transform: 'rotate(-90deg)',
  },
  buttonFixed: {
    position: 'fixed',
    bottom: 0,
    borderRadius: '12px 12px 0px 0px',
  },
  alignTitle: {
    textAlign: 'center',
  },
});

interface SurveyUnitHeaderProps {
  surveyUnit: SurveyUnit;
}

export function SurveyUnitHeader({ surveyUnit }: Readonly<SurveyUnitHeaderProps>) {
  const theme = useTheme();
  const classes = useStyles();
  const [isContactOutcomeValid, setIsContactOutcomeValid] = useState(false);
  const { responses } = useIdentificationQuestions(surveyUnit);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const allQuestionsAnswered = Object.values(responses).every(
      value => value !== null && value !== undefined
    );

    setIsCompleted(allQuestionsAnswered);
  }, [responses]);

  useEffect(() => {
    const checkContactOutcomeValidity = () => {
      return !!surveyUnit.contactOutcome;
    };

    setIsContactOutcomeValid(checkContactOutcomeValidity());
  }, [surveyUnit.contactOutcome]);

  const [anchorElement, setAnchorElement] = useState<HTMLElement>();

  const handleOpen = (e: HTMLButtonElement) => {
    setAnchorElement(e);
  };

  const handleClose = () => {
    setAnchorElement(undefined);
  };

  const open = Boolean(anchorElement);
  const id = open ? 'simple-popover' : undefined;
  const states = Object.values(toDoEnum).filter(toDo => Number(toDo.order) < 6);
  const currentState = Number(getSuTodoState(surveyUnit).order);
  const canSubmit =
    getLastState(surveyUnit.states).type === surveyUnitStateEnum.WAITING_FOR_TRANSMISSION.type;

  return (
    <Box
      px={4}
      py={2}
      pr={0}
      sx={{ display: 'grid', gridTemplateColumns: '1fr 700px auto', alignItems: 'center', gap: 5 }}
      bgcolor="white.main"
    >
      {/* Left side */}
      <Row gap={4}>
        <PaperIconLink component={Link} to="/" elevation={0}>
          <KeyboardArrowLeftIcon />
        </PaperIconLink>
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
              {surveyUnit.sampleIdentifiers.nograp}
            </Typography>
          </Row>
          <PrivilegedPerson surveyUnit={surveyUnit} />
        </Stack>
      </Row>

      {/* Middle Side */}
      <Stepper activeStep={currentState - 1} alternativeLabel>
        {states.map(state => {
          return (
            <Step key={state.order}>
              <StepLabel icon={StepIcon(Number(state.order) < currentState, state.order)}>
                {Number(state.order) < currentState ? state.stepName : state.value}
              </StepLabel>
              {state.order === '4' && canSubmit && <SubmitButton surveyUnit={surveyUnit} />}
            </Step>
          );
        })}
      </Stepper>
      {/* Right Side */}
      <Box className={classes.rotateBox} sx={{ justifySelf: 'end' }}>
        <Button
          onClick={e => handleOpen(e.currentTarget)}
          variant="contained"
          color="primary"
          className={classes.buttonFixed}
        >
          {D.transmissionHelpButton}
        </Button>
      </Box>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorElement}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        className={classes.alignTitle}
      >
        <Typography sx={{ p: 2 }}>{D.transmissionHelperTitle}</Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              {isCompleted ? (
                <CheckCircleOutlineIcon htmlColor={theme.palette.green.main} />
              ) : (
                <FiberManualRecordOutlinedIcon />
              )}
            </ListItemIcon>
            <ListItemText primary={D.transmissionTaskIdentification} />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <FiberManualRecordOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary={D.transmissionTaskQuestionnaire} />
          </ListItem>

          <ListItem>
            <ListItemIcon>
              {isContactOutcomeValid ? (
                <CheckCircleOutlineIcon htmlColor={theme.palette.green.main} />
              ) : (
                <FiberManualRecordOutlinedIcon />
              )}
            </ListItemIcon>
            <ListItemText primary={D.transmissionTaskContactOutcome} />
          </ListItem>
        </List>
      </Popover>
    </Box>
  );
}

/**
 * Custom icon for the stepper
 */
const StepIcon = (completed: boolean, icon: string): ReactNode => {
  if (completed) {
    return <CheckIcon fontSize="inherit" color="primary" />;
  }
  return <>{icon}</>;
};
