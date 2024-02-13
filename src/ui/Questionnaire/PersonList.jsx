import React from 'react';
import { Grid, IconButton, Stack,Button } from '@mui/material';
import { Typography } from '../Typography';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';
import SlowMotionVideoIcon from '@mui/icons-material/SlowMotionVideo';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import CustomChip from './CustomChip';
import CircleIcon from './Icons/CircleIcon';
import TimeIcon from './Icons/TimeIcon';
import DisturbIcon from './Icons/DisturbIcon';
import EditIcon from './Icons/EditIcon';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  stackBackground: {
    backgroundColor: '#F5F7FA',
  },
  stackBackgroundSize: {
    backgroundColor: '#F5F7FA',
    height: '80px',
    width: '97%',
  },
  gridBackground: {
    backgroundColor: '#57677D0F',
  },
  flexGrid: {
    backgroundColor: '#57677D0F',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divFlex: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '2px',
  },
  radiusButton: {
    borderRadius: '12px 12px 0px 0px !important',
  },
  specificButton: {
    marginRight: '16px',
  },
  personOutline: {
    width: '30px',
    margin: '8px',
  },
});

const PersonList = ({
  data,
  getColorForPerson,
  questionnaireProgress,
  questionnairesVisible,
  toggleQuestionnaire,
  handleStartQuestionnaire,
  isHouseHoldFinished,
  toggleModal,
}) => {
  const classes = useStyles();

  return (
    <Stack gap={2}>
      {data.map((person, index) => (
        <React.Fragment key={index}>
          <Grid container spacing={1} gap={1} alignItems="center">
            <Grid item>
              <PersonOutlineOutlinedIcon
                className={classes.personOutline}
                style={{
                  color: getColorForPerson(person.age),
                }}
              />
            </Grid>
            <Grid
              item
              xs={isHouseHoldFinished && getColorForPerson(person.age) !== 'lightGrey' ? 2.5 : 3}
              p={1}
              className={classes.gridBackground}
            >
              <Typography style={{ color: getColorForPerson(person.age) }}>
                {person.name}
              </Typography>
            </Grid>
            <Grid
              item
              xs={isHouseHoldFinished && getColorForPerson(person.age) !== 'lightGrey' ? 2.9 : 4.2}
              p={1}
              className={classes.gridBackground}
            >
              <Typography style={{ color: getColorForPerson(person.age) }}>
                {person.gender}
              </Typography>
            </Grid>
            <Grid
              item
              xs={isHouseHoldFinished && getColorForPerson(person.age) !== 'lightGrey' ? 2.9 : 4.2}
              p={1}
              className={classes.gridBackground}
            >
              <Typography style={{ color: getColorForPerson(person.age) }}>{person.age}</Typography>
            </Grid>
            {isHouseHoldFinished && getColorForPerson(person.age) !== 'lightGrey' && (
              <Grid item xs={3.05} className={classes.flexGrid}>
                <div className={classes.divFlex}>
                  <CustomChip
                    label={questionnaireProgress[index]}
                    icon={
                      questionnaireProgress[index] === 'terminé' ? (
                        <CircleIcon />
                      ) : questionnaireProgress[index] === 'en cours' ? (
                        <TimeIcon />
                      ) : (
                        <DisturbIcon />
                      )
                    }
                    color={
                      questionnaireProgress[index] === 'terminé'
                        ? 'green'
                        : questionnaireProgress[index] === 'en cours'
                          ? '#FD8A02'
                          : '#6C6E70'
                    }
                    shadow={true}
                  />
                </div>
                <IconButton onClick={() => toggleQuestionnaire(index)} size="small">
                  {questionnairesVisible[index] ? (
                    <ExpandLessOutlinedIcon />
                  ) : (
                    <ExpandMoreOutlinedIcon />
                  )}
                </IconButton>
              </Grid>
            )}
            {questionnairesVisible[index] &&
              isHouseHoldFinished &&
              getColorForPerson(person.age) !== 'lightGrey' && (
                <Grid item xs={12} container justifyContent="flex-end">
                  <Stack
                    className={classes.stackBackgroundSize}
                    gap={2}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Stack gap={2} direction="row" alignItems="center">
                      <EditIcon />
                      <Typography as="label" variant="m" color="textTertiary">
                        Questionnaire
                      </Typography>
                    </Stack>
                    {questionnaireProgress[index] === 'terminé' ? (
                      <Button
                        onClick={toggleModal}
                        color="surfaceSecondary"
                        variant="edge"
                        startIcon={<BorderColorOutlinedIcon fontSize="small" />}
                      >
                        Modifier
                      </Button>
                    ) : (
                      <Button
                        className={classes.specificButton}
                        color="textPrimary"
                        variant="contained"
                        startIcon={<SlowMotionVideoIcon fontSize="small" />}
                        onClick={() => handleStartQuestionnaire(index)}
                      >
                        {questionnaireProgress[index] === 'en cours' ? 'Reprendre' : 'Démarrer'}
                      </Button>
                    )}
                  </Stack>
                </Grid>
              )}
          </Grid>
        </React.Fragment>
      ))}
    </Stack>
  );
};

export default PersonList;