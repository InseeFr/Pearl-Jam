import Paper from '@mui/material/Paper';

const style = {
  width: 24,
  height: 24,
  borderRadius: 24,
  padding: 0.25,
  display: 'inline-block',
  border: 'none',
  bgcolor: 'surfaceTertiary.main',
  cursor: 'pointer',
  '& svg': {
    width: 20,
    height: 20,
  },
  '&:hover': {
    bgcolor: 'surfaceTertiary.light',
  },
};

export function PaperIconButton(props) {
  return (
    <Paper
      component="button"
      aria-label="delete"
      elevation={2}
      sx={{ ...style, ...props.sx }}
      {...props}
    />
  );
}
