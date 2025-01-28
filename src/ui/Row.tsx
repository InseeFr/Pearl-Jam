import Stack, { StackProps } from '@mui/material/Stack';

/**
 * A horizontal stack
 */

type RowTypes = Omit<StackProps, 'direction'>;
export function Row(props: Readonly<RowTypes>) {
  return <Stack direction="row" alignItems="center" {...props} />;
}
