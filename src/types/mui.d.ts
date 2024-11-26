import { Button } from '@mui/material/Button';
import { Card } from '@mui/material/Card';
import { ScrollableBox } from '@mui/material/ScrollableBox';

// Update the Card's variant prop options
declare module '@mui/material/Card' {
  interface CardPropsVariantOverrides {
    disabled: true;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    disabled: true;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    white: true;
  }
}

declare module '@mui/material/ScrollableBox' {
  interface ScrollableBoxPropsHeightOverrides {
    height: true;
  }
}
