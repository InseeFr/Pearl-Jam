import Stack from '@mui/material/Stack';
import { FilledInput } from '@mui/material';
import { Typography } from '../Typography';
import React from 'react';
import D from 'i18n';


/**
 * @param {string} value
 * @param {(v: string) => void} onChange
 * @param {import('@mui/material').FilledInputProps} props
 * @constructor
 */
export function CommentField({ value, onChange, ...props }) {
  const maxChar = 999;
  const handleChange = e => {
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
          },
        }}
        minRows={8}
        maxRows={8}
        value={value}
        onChange={handleChange}
        variant="filled"
        label="Commentaire"
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
