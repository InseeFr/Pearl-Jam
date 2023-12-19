declare module '@mui/material/styles' {
  /**
   * Variants
   */
  interface CardVariants {
    disabled: React.CSSProperties;
  }
  // allow configuration using `createTheme`
  interface CardVariantsOptions {
    disabled?: React.CSSProperties;
  }

  /**
   * Colors
   */
  interface Palette {
    white: Palette['primary'];
    green: Palette['primary'];
    separator: Palette['primary'];
    red: Palette['primary'];
    surfacePrimary: Palette['primary'];
    surfaceSecondary: Palette['primary'];
    black: Palette['primary'];
    textPrimary: Palette['primary'];
    textHint: Palette['primary'];
    textTertiary: Palette['primary'];
    accent: Palette['primary'];
    iconLock: Palette['primary'];
  }

  interface PaletteOptions {
    white?: Palette['primary'];
    green?: Palette['primary'];
    separator?: Palette['primary'];
    red?: Palette['primary'];
    surfacePrimary?: Palette['primary'];
    surfaceSecondary?: Palette['primary'];
    black?: Palette['primary'];
    textPrimary?: Palette['primary'];
    textHint?: Palette['primary'];
    textTertiary?: Palette['primary'];
    accent?: Palette['primary'];
    iconLock?: Palette['primary'];
  }
}

// Update the Card's variant prop options
declare module '@mui/material/Card' {
  interface CardPropsVariantOverrides {
    disabled: true;
  }
}
