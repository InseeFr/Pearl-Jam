import { createTheme } from '@mui/material';
import '@fontsource/montserrat/800.css';
import '@fontsource/montserrat/700.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/500.css';
import { ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

const fontFamily = 'Montserrat, sans-serif';

const baseTheme = createTheme({
  typography: {
    fontFamily: fontFamily,
    fontWeight: 600,
    button: {
      fontSize: '.875rem',
      lineHeight: '1.125rem',
      fontWeight: 600,
      textTransform: 'none',
    },
    headingXL: {
      fontSize: '3rem',
      lineHeight: '3.5rem',
    },
    headingL: {
      fontSize: '2.25rem',
      lineHeight: '3rem',
    },
    headingM: {
      fontSize: '1.75rem',
      lineHeight: '2.25rem',
    },
    headingS: {
      fontSize: '1.5rem',
      lineHeight: '1.75rem',
    },
    xl: {
      fontSize: '1.25rem',
      lineHeight: '1.5rem',
    },
    l: {
      fontSize: '1.125rem',
      lineHeight: '1.375rem',
    },
    m: {
      fontSize: '1rem',
      lineHeight: '1.25rem',
    },
    s: {
      fontSize: '.875rem',
      lineHeight: '1.125rem',
    },
    xs: {
      fontSize: '.75rem',
      lineHeight: '1rem',
    },
  },
  palette: {
    white: {
      main: '#FFF',
    },
    green: {
      main: '#019A3E',
    },
    red: {
      main: '#ED1443',
    },
    surfacePrimary: {
      main: '#F5F7FA',
    },
    surfaceSecondary: {
      main: '#FFF',
    },
    typographyblack: {
      main: '#000000',
    },
    typographyprimary: {
      main: '#0A192E',
    },
    typographyhint: {
      main: '#797676',
    },
    typographytertiary: {
      main: '#57677D',
    },
    typographyaccent: {
      main: '#ED1443',
    },
  },
});

export const theme = createTheme(baseTheme, {
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: 'contained' },
          style: {
            padding: '.5rem 1rem',
          },
        },
      ],
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiPopper: {
      defaultProps: {
        slotProps: {
          paper: {
            sx: {
              borderRadius: 16,
            },
          },
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          headingXL: 'h1',
          headingL: 'h2',
          headingM: 'h3',
          headingS: 'h4',
          xl: 'p',
          l: 'p',
          m: 'p',
          s: 'p',
          xs: 'p',
        },
      },
    },
  },
});

/**
 * Material theme provider embedded in a component
 */
export function PearlTheme({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
