import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { theme } from './PearlTheme';
import React from 'react';

/**
 * @param {(v: string) => void} onChange
 * @param {string} value
 * @return {JSX.Element}
 * @constructor
 */
export function SearchField({ onChange, value }) {
  return (
    <TextField
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="Nom, prénom, ville, enquête, ID..."
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
