import MenuItem from '@mui/material/MenuItem';
import SelectMaterial from '@mui/material/Select';
import React from 'react';

interface SelectProps extends React.ComponentProps<typeof SelectMaterial> {
  options: { value: string | number; label: string }[];
  placeholder: string;
  allowEmpty: boolean;

  /**
   * Select menu
   * @param {{value: string | number, label: string}[]} options
   * @param {string} placeholder
   * @param {bool} allowEmpty
   * @param {import('react').ComponentProps<typeof SelectMaterial>} props
   */
}

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

        return options.find(o => o.value === selected)?.label ?? <>{selected}</>;
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
