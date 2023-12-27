import { createTheme } from '@mui/material/styles';
import '@fontsource/montserrat/800.css';
import '@fontsource/montserrat/700.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/400.css';
import { ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

export const red = {
  '100': '#FFB7C6',
  '200': '#FF93AA',
  '300': '#F26987',
  '400': '#F33B63',
  '500': '#ED1443',
  '600': '#C51138',
  '700': '#AD0D30',
  '800': '#980727',
  '900': '#80031E',
};

export const gray = {
  '100': '#F5F7FA',
  '200': '#E6EAF0',
  '300': '#D3DBE5',
  '400': '#BCC2CC',
  '500': '#7C8A9D',
  '600': '#57677D',
  '700': '#3A4657',
  '800': '#1D2A3D',
  '900': '#0A192E',
};

const fontFamily = 'Montserrat, sans-serif';

let theme = createTheme({});
const colors = color => theme.palette.augmentColor({ color: { main: color } });

theme = createTheme({
  shadows: [
    'none',
    '0px 1px 4px 0px rgba(80, 76, 75, 0.80)',
    '0px 2px 4px 0px rgba(80, 76, 75, 0.25);',
    '0px 0px 4px 0px rgba(80, 76, 75, 0.25);',
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
    black: {
      main: '#000000',
    },
    green: colors('#35C758'),
    separator: {
      main: '#D7DBE1',
    },
    surfacePrimary: {
      main: '#F5F7FA',
    },
    surfaceSecondary: colors('#FFF'),
    surfaceTertiary: {
      main: '#E6EAF0',
    },
    primary: colors('#0A192E'),
    secondary: colors('#797676'),
    textPrimary: colors('#0A192E'),
    textHint: {
      main: '#797676',
    },
    textTertiary: {
      main: '#57677D',
    },
    accent: theme.palette.augmentColor({
      color: {
        main: red['500'],
      },
    }),
    iconLock: {
      main: '#323232',
    },
  },
});

theme = createTheme(theme, {
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: 'contained' },
          style: {
            padding: `${theme.spacing(1.25)} ${theme.spacing(2)}`,
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
          borderRadius: theme.spacing(2),
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
        {
          props: { raised: true },
          style: { background: theme.palette.surfacePrimary.main },
        },
      ],
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          '& svg': {
            strokeLinecap: 'round',
          },
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          ...theme.typography.xl,
          padding: '1.5rem',
          textAlign: 'center',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '0 1.5rem 1.5rem',
        },
      },
    },
    MuiDialogContentText: {
      styleOverrides: {
        root: {
          ...theme.typography.s,
          color: theme.palette.textTertiary.main,
          fontWeight: 600,
          ['& svg']: {
            verticalAlign: 'middle',
          },
        },
      },
      variants: [
        {
          props: { variant: 'm' },
          style: theme.typography.m,
        },
      ],
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 'auto',
        },
        indicator: {
          backgroundColor: theme.palette.textPrimary.main,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '1rem',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          padding: `${theme.spacing(1)} 0`,
          color: theme.palette.textHint.main,
          minHeight: 'auto',
          '& ~ .MuiTab-root': {
            marginLeft: 20,
          },
          '&[aria-selected="true"]': {
            color: theme.palette.textPrimary.main,
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: theme.spacing(3),
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          marginLeft: 0,
          gap: theme.spacing(1),
        },
        label: {
          ...theme.typography.s,
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          color: theme.palette.textTertiary.main,
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          marginLeft: 0,
          height: 15,
          minWidth: 18,
          transform: 'scale(1) translate(50%, -10%)',
          padding: `${theme.spacing(0.25)} ${theme.spacing(0.5)}`,
        },
      },
    },
    MuiAccordion: {
      variants: [
        {
          props: { variant: 'dense' },
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
              borderRadius: theme.spacing(2),
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
    MuiChip: {
      styleOverrides: {
        root: {
          ...theme.typography.s,
        },
      },
    },
    MuiSelect: {
      variants: [
        {
          props: { size: 'small' },
          style: {
            ...theme.typography.s,
            '& .MuiSelect-select': {
              minHeight: 'auto',
              padding: theme.spacing(1),
            },
            '& .MuiSelect-select em': {
              ...theme.typography.s,
            },
          },
        },
        {
          props: { variant: 'standard' },
          style: {
            padding: 0,
            backgroundColor: theme.palette.surfaceSecondary.main,
            borderColor: 'transparent',
            boxShadow: theme.shadows[2],
            width: '100%',
            '&::before': {
              display: 'none',
            },
            em: {
              color: theme.palette.textHint.main,
              fontStyle: 'normal',
            },
          },
        },
      ],
    },
    MuiTableCell: {
      variants: [
        {
          props: { variant: 'head' },
          style: {
            color: '#000',
            fontWeight: 700,
            ...theme.typography.s,
            backgroundColor: theme.palette.surfaceTertiary.main,
            border: 'solid 2px #FFFF',
            '&:last-child': {
              borderTopRightRadius: '1rem',
            },
            '&:first-child': {
              borderTopLeftRadius: '1rem',
            },
          },
        },
        {
          props: { variant: 'body' },
          style: {
            ...theme.typography.s,
            fontWeight: 500,
            backgroundColor: theme.palette.surfacePrimary.main,
            border: 'solid 2px #FFFF',
          },
        },
        {
          props: { variant: 'standard' },
          style: {
            padding: 0,
            backgroundColor: theme.palette.surfaceSecondary.main,
            borderColor: 'transparent',
            boxShadow: theme.shadows[2],
            width: '100%',
            '&::before': {
              display: 'none',
            },
            em: {
              color: theme.palette.textHint.main,
              fontStyle: 'normal',
            },
          },
        },
      ],
    },
  },
});

export { theme };

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
