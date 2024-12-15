import Stack from '@mui/material/Stack';
import { ComponentProps } from 'react';

/**
 * A horizontal stack
 */

type RowTypes = Omit<ComponentProps<typeof Stack>, 'direction' | 'alignItems'>;
export function Row(props: Readonly<RowTypes>) {
  return <Stack direction="row" alignItems="center" {...props} />;
}
