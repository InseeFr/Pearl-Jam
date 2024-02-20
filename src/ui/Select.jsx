import MenuItem from '@mui/material/MenuItem';
import SelectMaterial from '@mui/material/Select';
import React from 'react';

/**
 * Select menu
 * @param {{value: string | number, label: string}[]} options
 * @param {string} placeholder
 * @param {bool} allowEmpty
 * @param {import('react').ComponentProps<typeof SelectMaterial>} props
 */
export function Select({ options, placeholder, allowEmpty, ...props }) {
  return (
    <SelectMaterial
      variant="standard"
      size="small"
      displayEmpty
      renderValue={selected => {
        if (!selected) {
          return <em>{placeholder}</em>;
        }

        return options.find(o => o.value === selected)?.label ?? selected;
      }}
      {...props}
      onChange={e => props?.onChange(e.target.value)}
    >
      {allowEmpty && (
        <MenuItem dense value="">
          {placeholder}
        </MenuItem>
      )}
      {options?.map(o =>
        (typeof o === 'object' && o.value !== "") ? (
          <MenuItem key={o.value} dense value={o.value}>
            {o.label}
          </MenuItem>
        ) : typeof o === 'string' && o !== "" ? (
          <MenuItem key={o} dense value={o}>
            {o}
          </MenuItem>
        ) : null
      )}
    </SelectMaterial>
  );
}
