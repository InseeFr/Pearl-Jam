import Typography from '@mui/material/Typography';

/**
 * Wrapper component to style text using design system tokens
 *
 * @param {"headingXL" | "headingL" | "headingM" | "headingS" | "xl" | "l" | "m" | "s" | "xs"} variant
 * @param {"primary" | "hint" | "tertiary" | "black" | "accent"} color
 * @param {800 | 700 | 600 | 500 | 400} fontWeight
 * @return {JSX.Element}
 */
export function Text ({variant, color = 'primary', fontWeight = 600, ...props}) {
  return <Typography variant={variant} color={`typography${color}.main`} fontWeight={fontWeight} {...props}/>
}
