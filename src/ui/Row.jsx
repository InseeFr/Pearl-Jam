import Stack from '@mui/material/Stack';

/**
 * A horizontal stack
 *
 * @param {import('react').ComponentProps<typeof Stack>} props
 */
export function Row(props) {
  return <Stack direction="row" alignItems="center" {...props} />;
}
