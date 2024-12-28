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
    textPrimary: true;
    danger: true;
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
    textHint: true;
  }
}

declare module '@mui/material/IconButton' {
  interface IconButtonPropsColorOverrides {
    textPrimary: true;
  }
}

declare module '@mui/material/Badge' {
  interface BadgePropsColorOverrides {
    accent: true;
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
    green: true;
    surfaceTertiary: true;
  }
}

declare module '@mui/material/Switch' {
  interface SwitchPropsColorOverrides {
    green: true;
  }
}

declare module '@mui/material/styles/createPalette' {
  interface Palette {
    surfaceSecondary: Palette['primary'];
    black: Palette['primary'];
    separator: Palette['primary'];
    textTertiary: Palette['primary'];
    textHint: Palette['primary'];
    textPrimary: Palette['primary'];
    white: Palette['primary'];
    surfacePrimary: Palette['primary'];
    surfaceTertiary: Palette['primary'];
    green: Palette['primary'];
    danger: Palette['primary'];
    red: Palette['primary'];
    yellow: Palette['primary'];
    accent: Palette['primary'];
    iconLock: Palette['primary'];
  }
  interface PaletteOptions {
    surfaceSecondary: PaletteOptions['primary'];
    black: PaletteOptions['primary'];
    separator: PaletteOptions['primary'];
    textTertiary: PaletteOptions['primary'];
    textTertiary: PaletteOptions['primary'];
    textHint: PaletteOptions['primary'];
    textPrimary: PaletteOptions['primary'];
    white: PaletteOptions['primary'];
    green: PaletteOptions['primary'];
    red: PaletteOptions['primary'];
    yellow: PaletteOptions['primary'];
    danger: PaletteOptions['primary'];
    surfacePrimary: PaletteOptions['primary'];
    surfaceTertiary: PaletteOptions['primary'];
    accent: PaletteOptions['primary'];
    iconLock: PaletteOptions['primary'];
  }
}

declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
    disabled: true;
    dense: true;
  }
}

declare module '@mui/material/styles' {
  interface TypographyVariants {
    xs: React.CSSProperties;
    s: React.CSSProperties;
    m: React.CSSProperties;
    l: React.CSSProperties;
    xl: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    xs?: React.CSSProperties;
    s?: React.CSSProperties;
    m?: React.CSSProperties;
    l?: React.CSSProperties;
    xl?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    xs: true;
    s: true;
    m: true;
    l: true;
    xl: true;
  }
}
