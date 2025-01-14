import MenuItem from '@mui/material/MenuItem';
import SelectMaterial, { SelectProps as MaterialSelectProps } from '@mui/material/Select';
import D from 'i18n';

type SelectProps = {
  options: { value: string | number; label: string }[];
  placeholder?: string;
  allowEmpty?: boolean;
} & MaterialSelectProps;

export function Select({ options, placeholder, allowEmpty, ...props }: Readonly<SelectProps>) {
  return (
    <SelectMaterial
      variant="standard"
      size="small"
      displayEmpty
      renderValue={selected => {
        if (!selected) {
          return <em>{placeholder}</em>;
        }
        return options.find(o => o.value === selected)?.label ?? D.missingValue;
      }}
      {...props}
      onChange={(e, child) => {
        if (props.onChange) props.onChange(e, child);
      }}
    >
      {allowEmpty && (
        <MenuItem dense value="">
          {placeholder}
        </MenuItem>
      )}
      {options?.map(o =>
        typeof o === 'object' ? (
          <MenuItem key={o.value} dense value={o.value}>
            {o.label}
          </MenuItem>
        ) : (
          <MenuItem key={o} dense value={o}>
            {o}
          </MenuItem>
        )
      )}
    </SelectMaterial>
  );
}
