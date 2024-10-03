import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import DoorFrontOutlinedIcon from '@mui/icons-material/DoorFrontOutlined';
import SlowMotionVideoIcon from '@mui/icons-material/SlowMotionVideo';
import { Button } from '@mui/material';
import { Row } from '../Row';
import { Typography } from '../Typography';
import CustomChip from './CustomChip';
import CircleIcon from './Icons/CircleIcon';
import DisturbIcon from './Icons/DisturbIcon';
import TimeIcon from './Icons/TimeIcon';

const HousingResident = ({ startHousing, finishedHousing, toggleHousing, toggleModal }) => {
  return (
    <Row justifyContent="space-between">
      <Row gap={2}>
        <DoorFrontOutlinedIcon fontSize="large" />
        <Typography as="h2" variant="xl" fontWeight={700}>
          Habitants du logement
        </Typography>
        {!finishedHousing && (
          <CustomChip
            label={!startHousing ? 'Non commencé' : 'En cours'}
            icon={startHousing ? <TimeIcon /> : <DisturbIcon />}
            color={startHousing ? '#FD8A02' : '#6C6E70'}
            shadow={true}
          />
        )}
        {finishedHousing && (
          <CustomChip label="Terminé" icon={<CircleIcon />} color="green" shadow={true} />
        )}
      </Row>
      {!finishedHousing && (
        <Button
          onClick={toggleHousing}
          color="textPrimary"
          variant="contained"
          startIcon={<SlowMotionVideoIcon fontSize="small" />}
        >
          {startHousing ? 'Reprendre' : 'Démarrer'}
        </Button>
      )}
      {finishedHousing && (
        <Button
          onClick={toggleModal}
          color="surfaceSecondary"
          variant="edge"
          startIcon={<BorderColorOutlinedIcon fontSize="small" />}
        >
          {D.editButton}
        </Button>
      )}
    </Row>
  );
};

export default HousingResident;
