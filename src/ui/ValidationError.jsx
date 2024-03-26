import Box from '@mui/material/Box';
import { ZodError } from 'zod';

/**
 * Display information about errors
 * @param {ZodError} error
 * @param {import('@mui/material').BoxProps} props
 */
export function ValidationError({ error, ...props }) {
  if (!error || !(error instanceof ZodError)) {
    return null;
  }
  return (
    <Box typography="s" color="red.main" fontWeight={500} {...props}>
      {error.issues.map((issue, k) => (
        <Box key={issue.code + k}>
          {issue.path.join('.')} : {issue.message}
        </Box>
      ))}
    </Box>
  );
}
