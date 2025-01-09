import { SxProps, Theme } from '@mui/material';
import TypographyMaterial from '@mui/material/Typography';
import { forwardRef } from 'react';

interface TypographyProps {
  variant: string;
  color: string;
  fontWeight: number;
  noWrap: boolean;
  sx: SxProps<Theme>;
}

/**
 * Wrapper component to style text using design system tokens
 */
export const Typography = forwardRef<TypographyProps, any>(
  ({ variant = 'm', color = 'textPrimary', fontWeight = 600, ...props }, ref) => {
    if (props.noWrap) {
      props.sx = { maxWidth: '100%', minWidth: 0, ...props.sx };
    }
    return (
      <TypographyMaterial
        ref={ref}
        variant={variant}
        color={`${color}.main`}
        fontWeight={fontWeight}
        {...props}
      />
    );
  }
);
