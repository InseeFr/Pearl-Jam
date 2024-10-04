import Stack from '@mui/material/Stack';
import { FilledInput } from '@mui/material';
import { Typography } from '../Typography';
import D from 'i18n';

interface CommentFieldProps {
  value: string;
  onChange: (v: string) => void;
}

/**
 * @param {string} value
 * @param {(v: string) => void} onChange
 * @param {import('@mui/material').FilledInputProps} props
 * @constructor
 */
export function CommentField({ value, onChange, ...props }: CommentFieldProps) {
  const maxChar = 999;
  const handleChange = (e: { target: { value: string } }) => {
    if (e.target.value.length > maxChar) {
      return;
    }
    onChange(e.target.value);
  };
  return (
    <Stack gap={1}>
      <FilledInput
        sx={{
          padding: '0rem',
          minWidth: 500,
        }}
        inputProps={{
          sx: {
            padding: '1rem',
            variant: 'filled',
            label: 'Commentaire',
          },
        }}
        minRows={8}
        maxRows={8}
        value={value}
        onChange={handleChange}
        multiline
        placeholder={D.enterComment}
        {...props}
      />
      <Typography variant="xs" color="textHint" textAlign="right">
        {value.length}/{maxChar}
      </Typography>
    </Stack>
  );
}
