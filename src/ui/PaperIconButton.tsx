import Paper, { PaperProps } from '@mui/material/Paper';
import { PropsWithoutRef } from 'react';
import { Link, LinkProps } from 'react-router-dom';

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

export function PaperIconButton(props: Readonly<PaperProps<'button'>>) {
  return <Paper component="button" elevation={2} sx={{ ...style, ...props.sx }} {...props} />;
}

export function PaperIconLink(props: Readonly<PaperProps<typeof Link>>) {
  return <Paper component={Link} elevation={2} sx={{ ...style, ...props.sx }} {...props} />;
}
