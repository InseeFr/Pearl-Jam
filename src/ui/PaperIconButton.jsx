import Paper from '@mui/material/Paper';
import { theme } from './PearlTheme';

const style = {
  width: 24,
  height: 24,
  borderRadius: 24,
  padding: 0.25,
  display: 'inline-block',
  border: 'none',
  background: theme.palette.surfaceTertiary.main,
  cursor: 'pointer',
  '& svg': {
    width: 20,
    height: 20,
  },
  '&:hover': {
    background: theme.palette.surfaceTertiary.light,
  },
};

console.log(theme.palette.surfaceTertiary);

export function PaperIconButton(props) {
  return (
    <Paper
      component="button"
      bgcolor="surfaceTertiary.main"
      aria-label="delete"
      alignItems="center"
      justifyContent="center"
      elevation={2}
      sx={{ ...style, ...props.sx }}
      {...props}
    />
  );
}
