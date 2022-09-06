import AddIcon from '@material-ui/icons/Add';
import AssignmentIcon from '@material-ui/icons/Assignment';
import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import CloseIcon from '@material-ui/icons/Close';
import SendIcon from '@material-ui/icons/Send';

const ButtonIcons = {
  questionnaire: <AssignmentIcon />,
  transmit: <SendIcon />,
  rightArrow: <ChevronRightIcon />,
  add: <AddIcon fontSize="large" />,
  check: <CheckIcon />,
  close: <CloseIcon />,
};

const IconButton = ({ iconType, label, onClickFunction, hasArrow, disabled = false }) => {
  return (
    <Button
      variant="contained"
      color="secondary"
      startIcon={iconType && ButtonIcons[iconType]}
      endIcon={hasArrow ? ButtonIcons.rightArrow : <></>}
      onClick={onClickFunction}
      disabled={disabled}
    >
      {label}
    </Button>
  );
};

export default IconButton;
