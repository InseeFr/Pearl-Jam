import { Row } from './Row';
import { Typography } from './Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';
import React, { forwardRef } from 'react';
import Switch from '@mui/material/Switch';
import { Controller } from 'react-hook-form';

/**
 * Displays a field with the label on the side
 *
 * @param {boolean} required
 * @param {string} defaultValue
 * @param {string} label
 * @param {boolean} checkbox
 * @param {Record<string, unknown>} props
 * @returns {JSX.Element}
 */
export const FieldRow = forwardRef(({ label, maxWidth, checkbox, control, ...props }, ref) => {
  const isSwitchInput = !!(control && checkbox);
  const isTextInput = !isSwitchInput;

  return (
    <Row gap={3}>
      <Box sx={{ flex: 'none', minWidth: 90 }}>
        <Typography
          as="label"
          htmlFor={props.name}
          variant="s"
          color="textTertiary"
          sx={{ whiteSpace: 'noWrap' }}
        >
          {label}
          {props.required && (
            <Typography as="span" color="red" variant="s">
              {' *'}
            </Typography>
          )}
        </Typography>
      </Box>
      <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
        {isSwitchInput && (
          <Controller
            name={props.name}
            control={control}
            render={({ field }) => <Switch checked={field.value} color="green" {...field} />}
          />
        )}
        {isTextInput && (
          <OutlinedInput
            inputProps={props}
            inputRef={ref}
            fullWidth={!maxWidth}
            sx={{ maxWidth: maxWidth ? `${maxWidth}em` : undefined }}
            id={name}
          ></OutlinedInput>
        )}
      </Box>
    </Row>
  );
});
