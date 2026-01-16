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
import { forwardRef, PropsWithChildren } from 'react';
import {
  Control,
  Controller,
  ControllerRenderProps,
  FieldErrors,
  FieldValues,
} from 'react-hook-form';
import { RadioLine } from './RadioLine';
import { Row } from './Row';
import { Label, Typography } from './Typography';
import { FormHelperText } from '@mui/material';
import { ErrorMessage } from '@hookform/error-message';

type FieldRowProps = {
  label: string; // Label displayed alongside the field
  maxWidth?: string | number; // Optional max width for the field
  checkbox?: boolean; // Determines if the field is a checkbox
  control?: Control; // Any control element passed in (React children)
  type?: string;
  name?: string;
  options: { label: string; value: unknown; disabled?: boolean }[];
  defaultValue?: unknown;
  helperText?: string;
  errors?: FieldErrors<any>;
  onChange?: () => void;
  [key: string]: any; // Spread operator for any additional props
};

export const FieldRow = forwardRef<unknown, PropsWithChildren<FieldRowProps>>(
  ({ label, maxWidth, checkbox, control, defaultValue, children, ...props }, ref) => {
    const isControlled = !!props.type;

    if (isControlled && !control) {
      return `You must add 'control' props to use a ${props.type} field`;
    }

    return (
      <Row gap={3}>
        {label && (
          <Box sx={{ flex: 'none', minWidth: 90 }}>
            <Label
              id={`label-${props.name}`}
              htmlFor={props.name}
              variant="s"
              color="textTertiary"
              sx={{ whiteSpace: 'noWrap' }}
            >
              {label}
              {props.required && (
                <Typography component="span" color="red" variant="s">
                  {' *'}
                </Typography>
              )}
            </Label>
          </Box>
        )}
        <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
          {isControlled && (
            <Controller
              name={props.name ?? ''}
              control={control}
              render={({ field }) => (
                <ControlledField
                  defaultValue={defaultValue}
                  field={field}
                  name={props.name}
                  options={props.options}
                  type={props.type}
                  onChange={props.onChange}
                />
              )}
            />
          )}
          {!isControlled && (
            <OutlinedInput
              inputProps={props}
              inputRef={ref}
              fullWidth={!maxWidth}
              sx={{ maxWidth: maxWidth ? `${maxWidth}em` : undefined }}
              id={props.name}
            />
          )}
          {props.helperText && (
            <ErrorMessage
              errors={props.errors}
              name={props.name}
              render={({ message }) => (
                <FormHelperText sx={{ color: 'error.main', ml: 1 }}>{message}</FormHelperText>
              )}
            />
          )}
        </Box>
      </Row>
    );
  }
);

interface ControlledFieldProps {
  type?: string;
  name?: string;
  options: { label: string; value: unknown; disabled?: boolean }[];
  field: ControllerRenderProps<FieldValues, string>;
  defaultValue?: unknown;
  onChange?: () => void;
}
/**
 * Select the right field to display
 */
export function ControlledField({
  type,
  name,
  options,
  field,
  defaultValue,
  onChange,
}: Readonly<ControlledFieldProps>) {
  if (type === 'switch') {
    return (
      <Switch
        checked={field.value}
        color="green"
        {...field}
        onChange={e => {
          field.onChange(e);
          onChange?.();
        }}
      />
    );
  }
  if (type === 'datepicker') {
    return <DatePicker value={field.value} onChange={v => field.onChange(v.getTime())} />;
  }
  if (type === 'radios') {
    return (
      <RadioGroup
        defaultValue={defaultValue}
        value={defaultValue ? undefined : field.value}
        onChange={e => field.onChange(e.target.value)}
        row
        aria-labelledby={`label-${name}`}
        name={name}
      >
        {options.map((o: { value: unknown; label: string; disabled?: boolean }) => (
          <FormControlLabel
            value={o.value}
            control={<Radio sx={{ p: 0 }} />}
            label={o.label}
            key={o.label}
            onChange={onChange}
            disabled={o.disabled}
          />
        ))}
      </RadioGroup>
    );
  }
  if (type === 'radiostack') {
    return (
      <RadioGroup
        value={field.value}
        onChange={e => {
          field.onChange(e.target.value);
          onChange?.();
        }}
        row
        aria-labelledby={`label-${name}`}
        name={name}
      >
        <Stack gap={1}>
          {options.map(o => (
            <RadioLine value={o.value} label={o.label} disabled={false} key={o.label} />
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
