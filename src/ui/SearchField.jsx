import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { useTheme } from '@mui/material/styles';
import React from 'react';
import D from '../i18n/build-dictionary';

/**
 * @param {(v: string) => void} onChange
 * @param {string} value
 * @return {JSX.Element}
 * @constructor
 */
export function SearchField({ onChange, value }) {
  const theme = useTheme();
  return (
    <TextField
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={D.placeholderSearchHome}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="textPrimary" />
          </InputAdornment>
        ),
      }}
      sx={{
        border: 'none',
        backgroundColor: theme.palette.surfaceSecondary.main,
        borderRadius: '100px',
        '&::before': {
          display: 'none',
        },
        '& fieldset': {
          borderColor: 'transparent',
          borderRadius: '100px',
        },
      }}
    />
  );
}
