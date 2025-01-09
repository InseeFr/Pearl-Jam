import Box from '@mui/material/Box';
import { ZodError } from 'zod';

export interface ValidationErrorProps {
  error: ZodError;
  mt: number;
}

/**
 * Display information about errors
 */
export function ValidationError({ error, ...props }: Readonly<ValidationErrorProps>) {
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
