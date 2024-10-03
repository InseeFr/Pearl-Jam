import { Typography } from './Typography';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import Box from '@mui/material/Box';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { SxProps } from '@mui/material';
import { JsxElement } from 'typescript';
import React, { ReactNode } from 'react';

interface TextWithLabelProps {
  label: string;
  sx?: SxProps;
  children: JSX.Element | boolean | string;
}

/**
 * @param {string} label
 * @param {SxProps} sx - cf. MUI system
 * @param {JSX.Element} children
 */
export function TextWithLabel({ label, children, sx }: TextWithLabelProps) {
  if (children === true) {
    children = (
      <IconWrapper>
        <CheckOutlinedIcon fontSize="small" color="success" />
      </IconWrapper>
    );
  } else if (children === false) {
    children = (
      <IconWrapper>
        <CloseOutlinedIcon fontSize="small" color="error" />
      </IconWrapper>
    );
  }
  return (
    <div>
      <Typography as="span" color="textTertiary" variant="s" sx={sx}>
        {label} :
      </Typography>
      &nbsp; &nbsp;
      <Typography as="span" color="textPrimary" variant="s" sx={sx}>
        {children || '-'}
      </Typography>
    </div>
  );
}

interface IconWrapperProps {
  children: ReactNode;
}

function IconWrapper({ children }: IconWrapperProps) {
  return (
    <Box position="relative" display="inline-block">
      <Box position="absolute" sx={{ top: -15, left: -5 }}>
        {children}
      </Box>
    </Box>
  );
}
