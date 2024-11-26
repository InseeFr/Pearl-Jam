import { CircularProgressProps } from '@mui/material/CircularProgress';
//import { BoxProps } from '@mui/material/Box';

// Update the Card's variant prop options
declare module '@mui/material/Card' {
  interface CardPropsVariantOverrides {
    disabled: true;
  }
}

declare module '@mui/material/CircularProgress' {
  interface CircularProgressPropsColorOverrides {
    white: true;
  }
}
