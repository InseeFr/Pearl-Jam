import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { forwardRef } from 'react';
import { Controller } from 'react-hook-form';
import { RadioLine } from './RadioLine';
import { Row } from './Row';
import { Typography } from './Typography';
/**
 * Displays a field with the label on the side
 *
 * @param {boolean} required
 * @param {string} defaultValue
 * @param {string} label
 * @param {boolean} checkbox
 * @param {{type?: string}} props
 * @returns {JSX.Element}
 */
export const FieldRow = forwardRef(
  ({ label, maxWidth, checkbox, control, children, ...props }, ref) => {
    const isControlled = !!props.type;

    if (isControlled && !control) {
      return `You must add 'control' props to use a ${props.type} field`;
    }

    return (
      <Row gap={3}>
        {label && (
          <Box sx={{ flex: 'none', minWidth: 90 }}>
            <Typography
              as="label"
              id={`label-${props.name}`}
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
        )}
        <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
          {isControlled && (
            <Controller
              name={props.name}
              control={control}
              render={({ field }) => controlledField(props, field)}
            />
          )}
          {!isControlled && (
            <OutlinedInput
              inputProps={props}
              inputRef={ref}
              fullWidth={!maxWidth}
              sx={{ maxWidth: maxWidth ? `${maxWidth}em` : undefined }}
              id={name}
            />
          )}
        </Box>
      </Row>
    );
  }
);

/**
 * Select the right field to display
 *
 * @param {string} type
 * @param {string} name
 * @param {{label: string, value: unknown}[]} options
 * @param field
 * @returns {JSX.Element|null}
 */
export function controlledField({ type, name, options }, field) {
  if (type === 'switch') {
    return <Switch checked={field.value} color="green" {...field} />;
  }
  if (type === 'datepicker') {
    return <DatePicker value={field.value} onChange={v => field.onChange(v.getTime())} />;
  }
  if (type === 'radios') {
    return (
      <RadioGroup
        value={field.value}
        onChange={e => field.onChange(e.target.value)}
        row
        aria-labelledby={`label-${name}`}
        name={name}
      >
        {options.map(o => (
          <FormControlLabel
            key={o.value}
            value={o.value}
            control={<Radio sx={{ p: 0 }} />}
            label={o.label}
          />
        ))}
      </RadioGroup>
    );
  }
  if (type === 'radiostack') {
    return (
      <RadioGroup
        value={field.value}
        onChange={e => field.onChange(e.target.value)}
        row
        aria-labelledby={`label-${name}`}
        name={name}
      >
        <Stack gap={1}>
          {options.map(o => (
            <RadioLine value={o.value} key={o.value} label={o.label} />
          ))}
        </Stack>
      </RadioGroup>
    );
  }
  if (type === 'increment') {
    return (
      <Row gap={0.5}>
        <IconButton onClick={() => field.onChange(Math.max(field.value - 1, 0))}>
          <RemoveIcon color="textPrimary" fontSize="small" />
        </IconButton>
        <Row
          borderRadius={1}
          border={1}
          borderColor="surfaceTertiary.main"
          bgcolor="surfacePrimary.main"
          height={28}
          px={1}
          justifyContent="center"
          minWidth={30}
          typography="s"
          fontWeight={600}
          lineHeight={1}
        >
          {field.value ?? 0}
        </Row>
        <IconButton onClick={() => field.onChange(field.value + 1)}>
          <AddIcon color="textPrimary" fontSize="small" />
        </IconButton>
      </Row>
    );
  }
  return null;
}
