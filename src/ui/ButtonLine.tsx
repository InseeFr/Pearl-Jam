import ButtonBase from '@mui/material/ButtonBase';
import { Typography } from './Typography';
import { Row } from './Row';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { ButtonProps } from '@mui/material';

type ButtonLineProps = {
  disabled: boolean;
  label: string;
  checked: boolean;
} & Omit<ButtonProps, 'disabled'>;

export function ButtonLine({ disabled, label, checked, ...props }: Readonly<ButtonLineProps>) {
  const textColor = disabled ? 'textHint' : 'textPrimary';
  const background = disabled ? 'surfacePrimary.light' : 'surfacePrimary.main';
  return (
    <ButtonBase
      {...props}
      disabled={disabled}
      sx={{
        display: 'flex',
        bgcolor: background,
        borderRadius: 4,
        px: 2,
        py: 1,
        justifyContent: 'space-between',
      }}
    >
      <Typography variant="s" fontWeight={600} color={textColor}>
        {label}
      </Typography>
      <Row gap={2}>
        {checked && <CheckCircleIcon color="success" fontSize="medium" />}
        <KeyboardArrowRightIcon color={textColor} fontSize="medium" />
      </Row>
    </ButtonBase>
  );
}
