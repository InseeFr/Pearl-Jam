import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';

const style = {
  bgcolor: 'surfacePrimary.main',
  p: 1,
  m: 0,
  gap: 3,
  position: 'relative',
  '& .MuiFormControlLabel-label': {
    color: 'textPrimary.main',
  },
  '& .MuiFormControlLabel-label::before': {
    content: '""',
    position: 'absolute',
    width: '1px',
    top: 0,
    left: 38,
    height: '100%',
    bgcolor: 'separator.main',
  },
};

/**
 * @param {string} label
 * @param {boolean} disabled
 * @constructor
 */
export function RadioLine({ value, disabled, label }) {
  return (
    <FormControlLabel
      disabled={disabled}
      sx={style}
      value={value}
      control={<Radio size="small" sx={{ p: 0 }} />}
      label={label}
      slotProps={{
        typography: {
          variant: 's',
          fontWeight: 600,
        },
      }}
    />
  );
}
