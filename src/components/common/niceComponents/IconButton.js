import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import CloseIcon from '@material-ui/icons/Close';
import SendIcon from '@material-ui/icons/Send';
import ShoppingCartRounded from '@material-ui/icons/ShoppingCartRounded';

const ButtonIcons = {
  questionnaire: <ShoppingCartRounded />,
  transmit: <SendIcon />,
  rightArrow: <ChevronRightIcon />,
  add: <AddIcon fontSize="large" />,
  check: <CheckIcon />,
  close: <CloseIcon />,
};
export const ButtonIconTypes = ['questionnaire', 'transmit'];

const IconButton = ({ iconType, label, onClickFunction, hasArrow }) => {
  return (
    <Button
      variant="contained"
      startIcon={iconType && ButtonIcons[iconType]}
      endIcon={hasArrow ? ButtonIcons.rightArrow : <></>}
      onClick={onClickFunction}
    >
      {label}
    </Button>
  );
};

export default IconButton;
