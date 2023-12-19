import TypographyMaterial from '@mui/material/Typography';

/**
 * Wrapper component to style text using design system tokens
 *
 * @param {"headingXL" | "headingL" | "headingM" | "headingS" | "xl" | "l" | "m" | "s" | "xs"} variant
 * @param {"textPrimary" | "textHint" | "textTertiary" | "black" | "accent"} color
 * @param {800 | 700 | 600 | 500 | 400} fontWeight
 * @param {import('react').ComponentProps<typeof TypographyMaterial>} props
 * @return {JSX.Element}
 */
export function Typography({ variant = 'm', color = 'textPrimary', fontWeight = 600, ...props }) {
  return (
    <TypographyMaterial
      variant={variant}
      color={`${color}.main`}
      fontWeight={fontWeight}
      {...props}
    />
  );
}
