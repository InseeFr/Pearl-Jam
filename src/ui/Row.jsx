import Stack from '@mui/material/Stack';

/**
 * A horizontal stack
 *
 * @param {import('@mui/material').StackProps} props
 */
export function Row(props) {
  return <Stack direction="row" alignItems="center" {...props} />;
}
