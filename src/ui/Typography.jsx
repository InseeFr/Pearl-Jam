import TypographyMaterial from '@mui/material/Typography';
import { forwardRef } from 'react';

/**
 * Wrapper component to style text using design system tokens
 *
 * @param {"headingXL" | "headingL" | "headingM" | "headingS" | "xl" | "l" | "m" | "s" | "xs"} variant
 * @param {"textPrimary" | "textHint" | "textTertiary" | "black" | "accent"} color
 * @param {800 | 700 | 600 | 500 | 400} fontWeight
 * @param {import('@mui/material').TypographyProps} props
 * @return {JSX.Element}
 */
export const Typography = forwardRef(
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
