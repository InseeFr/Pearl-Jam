import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Typography } from '../Typography';
import { Row } from '../Row';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import CustomChip from './CustomChip';
import SlowMotionVideoIcon from '@mui/icons-material/SlowMotionVideo';
import Divider from '@mui/material/Divider';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import { makeStyles } from '@mui/styles';
import TimeIcon from './Icons/TimeIcon';
import CircleIcon from './Icons/CircleIcon';
import DisturbIcon from './Icons/DisturbIcon';
import HousingResident from './HousingResident';
import PersonList from './PersonList';

const useStyles = makeStyles({
  stackBackground: {
    backgroundColor: '#F5F7FA',
  },
  radiusButton: {
    borderRadius: '12px 12px 0px 0px !important',
  },
});

export function QuestionnaireCard() {
  const classes = useStyles();
  const data = [
    { name: 'Lisa', gender: 'Femme', age: '58 ans' },
    { name: 'Marc', gender: 'Homme', age: '61 ans' },
    { name: 'Paul', gender: 'Homme', age: '12 ans' },
  ];

  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [startHousing, setStartHousing] = useState(false);
  const [finishedHousing, setFinishedHousing] = useState(false);
  const [isHouseHoldInProgress, setIsHouseHoldInProgress] = useState(false);
  const [isHouseHoldFinished, setIsHouseHoldFinished] = useState(false);
  const [questionnairesVisible, setQuestionnairesVisible] = useState({});
  const [questionnaireProgress, setQuestionnaireProgress] = useState(
    data.reduce((acc, _, index) => ({ ...acc, [index]: 'non commencé' }), {})
  );

  const toggleQuestionnaire = index => {
    setQuestionnairesVisible(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  const handleStartQuestionnaire = index => {
    setQuestionnaireProgress(prev => {
      const currentState = prev[index];
      let newState;
      switch (currentState) {
        case 'non commencé':
          newState = 'en cours';
          break;
        case 'en cours':
          newState = 'terminé';
          break;
        default:
          newState = currentState;
      }
      return { ...prev, [index]: newState };
    });
  };

  const toggleDisclaimer = () => {
    setShowDisclaimer(!showDisclaimer);
  };

  const toggleHousing = () => {
    if (!startHousing) {
      setShowDisclaimer(false);
      setStartHousing(true);
    } else {
      setFinishedHousing(true);
    }
  };

  const toggleHouseHold = () => {
    if (isHouseHoldInProgress) {
      setIsHouseHoldFinished(true);
      setIsHouseHoldInProgress(false);
    } else {
      setIsHouseHoldInProgress(true);
      setIsHouseHoldFinished(false);
    }
  };

  const toggleModal = () => {
    // Logique pour le bouton Modifier
  };

  const isOfLegalAge = person => {
    // handle missing age -> can't be interviewed
    const { age = '10 ans' } = person;
    const ageNumber = parseInt(age.split(' ')[0]);
    return ageNumber > 16;
  };

  return (
    <Card p={2} elevation={0}>
      <CardContent>
        <Stack gap={3}>
          <HousingResident
            startHousing={startHousing}
            finishedHousing={finishedHousing}
            toggleHousing={toggleHousing}
            toggleModal={toggleModal}
          />
          <Stack gap={3}>
            <Row>
              <Button
                onClick={toggleDisclaimer}
                className={classes.radiusButton}
                color="textPrimary"
                variant="contained"
              >
                Champ de l'enquête
              </Button>
            </Row>
          </Stack>
        </Stack>
        {showDisclaimer && (
          <Stack className={classes.stackBackground}>
            <Typography m={2} as="label" variant="m" color="textTertiary">
              Tous les individus de 16 ans ou plus au 1er janvier de l'année en cours doivent
              répondre.
            </Typography>
          </Stack>
        )}
        <Stack gap={3}>
          <Divider />
          {finishedHousing && (
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <PeopleAltOutlinedIcon fontSize="large" />
                <Typography as="h2" variant="xl" fontWeight={700}>
                  Ménage 1
                </Typography>
                <CustomChip
                  label={
                    isHouseHoldFinished
                      ? 'Terminé'
                      : isHouseHoldInProgress
                        ? 'En cours'
                        : 'Non commencé'
                  }
                  icon={
                    isHouseHoldFinished ? (
                      <CircleIcon />
                    ) : isHouseHoldInProgress ? (
                      <TimeIcon />
                    ) : (
                      <DisturbIcon />
                    )
                  }
                  color={
                    isHouseHoldFinished ? 'green' : isHouseHoldInProgress ? '#FD8A02' : '#6C6E70'
                  }
                  shadow={true}
                />
              </Stack>
              <Stack>
                {isHouseHoldFinished ? (
                  <Button
                    onClick={toggleModal}
                    color="surfaceSecondary"
                    variant="edge"
                    startIcon={<BorderColorOutlinedIcon fontSize="small" />}
                  >
                    {D.editButton}
                  </Button>
                ) : (
                  <Button
                    onClick={toggleHouseHold}
                    color="textPrimary"
                    variant="contained"
                    startIcon={<SlowMotionVideoIcon fontSize="small" />}
                  >
                    {isHouseHoldInProgress ? 'Reprendre' : 'Démarrer'}
                  </Button>
                )}
              </Stack>
            </Stack>
          )}
          {startHousing && (
            <PersonList
              data={data}
              isOfLegalAge={isOfLegalAge}
              questionnaireProgress={questionnaireProgress}
              questionnairesVisible={questionnairesVisible}
              toggleQuestionnaire={toggleQuestionnaire}
              handleStartQuestionnaire={handleStartQuestionnaire}
              isHouseHoldFinished={isHouseHoldFinished}
              toggleModal={toggleModal}
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
