import React from 'react';
import { makeStyles } from '@mui/styles';
import Chip from '@mui/material/Chip';

const CustomChip = ({ label, icon, color, shadow }) => {
  return (
    <Chip
      label={label}
      variant="outlined"
      icon={icon}
      style={{
        fontSize: '12px',
        color: color,
        border: 'none',
        boxShadow: shadow ? '0px 1px 2px 0px rgba(0, 0, 0, 0.2)' : 'none',
        padding: '0px', 
        height: '24px',
      }}
    />
  );
};

export default CustomChip;

