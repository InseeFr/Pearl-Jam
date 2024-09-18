import { SxProps, Theme } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';
import TypographyMaterial from '@mui/material/Typography';
import { forwardRef} from 'react';

interface TypographyProps
{
  variant : string
  color : string
  fontWeight : number
  noWrap : boolean
  sx : SxProps<Theme>
}

export const Typography = 
  forwardRef<TypographyProps, any>(({ variant = 'm', color = 'textPrimary', fontWeight = 600, ...props }, ref) => {
    if (props.noWrap) {
      props.sx = { maxWidth: '100%', minWidth: 0, ...props.sx };
    }
    return (
      <TypographyMaterial
        ref={ref}
        variant={variant as Variant}
        color={`${color}.main`}
        fontWeight={fontWeight}
        {...props}
      />
    );
  });
