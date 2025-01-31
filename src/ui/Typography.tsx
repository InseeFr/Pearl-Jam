import TypographyMaterial, { TypographyProps } from '@mui/material/Typography';

/**
 * Wrapper component to style text using design system tokens
 */
export const Typography = ({
  variant = 'm',
  color = 'textPrimary',
  fontWeight = 600,
  ...props
}: TypographyProps) => {
  if (props.noWrap) {
    props.sx = { maxWidth: '100%', minWidth: 0, ...props.sx };
  }
  return (
    <TypographyMaterial
      {...props}
      color={`${color}.main`}
      variant={variant}
      fontWeight={fontWeight}
    />
  );
};

export const Label = (props: TypographyProps<'label'>) => (
  <Typography component="label" {...props}></Typography>
);
