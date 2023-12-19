import { createTheme } from '@mui/material/styles';
import '@fontsource/montserrat/800.css';
import '@fontsource/montserrat/700.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/500.css';
import { ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

const fontFamily = 'Montserrat, sans-serif';

const baseTheme = createTheme({
  shadows: [
    'none',
    '0px 1px 4px 0px rgba(80, 76, 75, 0.80)',
    '0px 2px 4px 0px rgba(80, 76, 75, 0.25);',
    '0px 2px 4px 0px rgba(80, 76, 75, 0.25);',
    '0px 2px 4px 0px rgba(80, 76, 75, 0.25);',
    '0px 2px 4px 0px rgba(80, 76, 75, 0.25);',
    '0px 2px 4px 0px rgba(80, 76, 75, 0.25);',
    '0px 2px 4px 0px rgba(80, 76, 75, 0.25);',
    '0px 2px 4px 0px rgba(80, 76, 75, 0.25);',
  ],
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
    separator: {
      main: '#D7DBE1',
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
    iconLock: {
      main: '#323232',
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
            padding: `${baseTheme.spacing(1)} ${baseTheme.spacing(2)}`,
          },
        },
        {
          props: { variant: 'underlined' },
          style: {
            textDecoration: 'underline',
          },
        },
        {
          props: { size: 'edge' },
          style: {
            padding: 0,
          },
        },
      ],
    },
    MuiCard: {
      styleOverrides: {
        root: {
          position: 'relative',
          borderRadius: baseTheme.spacing(2),
        },
      },
      variants: [
        {
          props: { variant: 'disabled' },
          style: {
            backgroundColor: '#E6EAF0',
            opacity: '0.5',
            '&:hover': {
              cursor: 'not-allowed',
            },
          },
        },
      ],
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: baseTheme.spacing(3),
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          marginLeft: 0,
          gap: baseTheme.spacing(1),
        },
        label: {
          ...baseTheme.typography.s,
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          color: baseTheme.palette.typographytertiary.main,
        },
      },
    },
    MuiAccordion: {
      variants: [
        {
          props: { variant: 'sidebar' },
          style: {
            ['&.Mui-expanded']: {
              margin: 0,
            },
            ['&::before']: {
              display: 'none',
            },
            ['& .MuiAccordionSummary-root']: {
              margin: 0,
              padding: 0,
              minHeight: 0,
            },
            ['& .MuiAccordionSummary-root.Mui-expanded']: {
              margin: 0,
              minHeight: 'auto',
            },
            ['& .MuiAccordionSummary-root .MuiAccordionSummary-content']: { margin: 0 },
          },
        },
      ],
    },
    MuiPopper: {
      defaultProps: {
        slotProps: {
          paper: {
            sx: {
              borderRadius: baseTheme.spacing(2),
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
          xl: 'span',
          l: 'span',
          m: 'span',
          s: 'span',
          xs: 'span',
        },
      },
    },
    MuiSelect: {
      variants: [
        {
          props: { size: 'small' },
          style: {
            ...baseTheme.typography.s,
            '& .MuiSelect-select': {
              minHeight: 'auto',
              padding: baseTheme.spacing(1),
            },
          },
        },
        {
          props: { variant: 'standard' },
          style: {
            padding: 0,
            backgroundColor: baseTheme.palette.surfaceSecondary.main,
            borderColor: 'transparent',
            boxShadow: baseTheme.shadows[2],
            width: '100%',
            '&::before': {
              display: 'none',
            },
            em: {
              color: baseTheme.palette.typographyhint.main,
              fontStyle: 'normal',
            },
          },
        },
      ],
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
