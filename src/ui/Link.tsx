import { Link as RouterLink } from 'react-router-dom';
import LinkMaterial from '@mui/material/Link';
import { ComponentProps } from 'react';

export function Link(props: Readonly<{ to: string} & Omit<ComponentProps<typeof LinkMaterial>, 'component'>>) {
  return <LinkMaterial component={RouterLink} {...props} />;
}
