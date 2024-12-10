import { Button } from '@mui/material/Button';
import { Card } from '@mui/material/Card';
import { ScrollableBox } from '@mui/material/ScrollableBox';
import { Dialog } from '@mui/material/Dialog';
import { CircularProgressProps } from '@mui/material/CircularProgress';

// Update the Card's variant prop options
declare module '@mui/material/Card' {
  interface CardPropsVariantOverrides {
    disabled: true;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    s: true;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    white: true;
    surfaceSecondary: true;
  }

  interface ButtonPropsVariantOverrides {
    edge: true;
  }
}

declare module '@mui/material/SvgIcon' {
  interface SvgIconPropsColorOverrides {
    iconLock: true;
    textTertiary: true;
    textPrimary: true;
    textPrimary: true;
    surfaceTertiary: true;
    yellow: true;
  }
}

declare module '@mui/material/ScrollableBox' {
  interface ScrollableBoxPropsHeightOverrides {
    height: true;
  }
}

declare module '@mui/material/Dialog' {
  interface DialogPropsMaxWidthOverrides {
    maxWidht: 's';
  }
}

declare module '@mui/material/CircularProgress' {
  interface CircularProgressPropsColorOverrides {
    white: true;
  }
}
