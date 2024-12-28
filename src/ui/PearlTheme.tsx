import { createTheme } from '@mui/material/styles';
import '@fontsource/montserrat/800.css';
import '@fontsource/montserrat/700.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/400.css';
import { Theme, ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { frFR as DatepickerfrFR } from '@mui/x-date-pickers/locales';
import { frFR } from '@mui/material/locale';
import { PropsWithChildren } from 'react';

export const red = {
  100: '#FFB7C6',
  200: '#FF93AA',
  300: '#F26987',
  400: '#F33B63',
  500: '#ED1443',
  600: '#C51138',
  700: '#AD0D30',
  800: '#980727',
  900: '#80031E',
};

export const gray = {
  100: '#F5F7FA',
  200: '#E6EAF0',
  300: '#D3DBE5',
  400: '#BCC2CC',
  500: '#7C8A9D',
  600: '#57677D',
  700: '#3A4657',
  800: '#1D2A3D',
  900: '#0A192E',
};

const fontFamily = 'Montserrat, sans-serif';

const basicTheme = createTheme({});
const colors = (theme: Theme, color: string) =>
  theme.palette.augmentColor({ color: { main: color } });

const coloredTheme = createTheme({
  basicTheme,
  shadows: [
    'none',
    '0px 1px 4px 0px rgba(80, 76, 75, 0.80)',
    '0px 2px 4px 0px rgba(80, 76, 75, 0.25);',
    ...basicTheme.shadows.slice(3),
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
    success: colors(basicTheme, '#089616'),
    green: colors(basicTheme, '#35C758'),
    danger: colors(basicTheme, red['500']),
    red: colors(basicTheme, red['500']),
    yellow: colors(basicTheme, '#FFC700'),
    separator: colors(basicTheme, '#D7DBE1'),
    surfacePrimary: colors(basicTheme, '#F5F7FA'),
    surfaceSecondary: colors(basicTheme, '#FFF'),
    surfaceTertiary: colors(basicTheme, '#E6EAF0'),
    primary: colors(basicTheme, '#0A192E'),
    secondary: colors(basicTheme, '#797676'),
    textPrimary: colors(basicTheme, '#0A192E'),
    textHint: colors(basicTheme, '#797676'),
    textTertiary: colors(basicTheme, '#57677D'),
    accent: colors(basicTheme, red['500']),
    iconLock: {
      main: '#323232',
    },
  },
});

const theme = createTheme(
  coloredTheme,
  {
    components: {
      MuiButton: {
        variants: [
          {
            props: { variant: 'contained' },
            style: {
              padding: `${coloredTheme.spacing(1.25)} ${coloredTheme.spacing(2)}`,
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
            borderRadius: coloredTheme.spacing(2),
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
            style: { background: coloredTheme.palette.surfacePrimary.main },
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
            ...coloredTheme.typography.xl,
            padding: '1.5rem',
            textAlign: 'center',
          },
        },
      },
      MuiDialogActions: {
        styleOverrides: {
          root: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            padding: '0 1.5rem 1.5rem',
          },
        },
      },
      MuiDialogContentText: {
        styleOverrides: {
          root: {
            ...coloredTheme.typography.s,
            color: coloredTheme.palette.textTertiary.main,
            fontWeight: 600,
            ['& svg']: {
              verticalAlign: 'middle',
            },
          },
        },
        variants: [
          {
            props: { variant: 'm' },
            style: coloredTheme.typography.m,
          },
        ],
      },
      MuiTabs: {
        styleOverrides: {
          root: {
            minHeight: 'auto',
          },
          indicator: {
            backgroundColor: coloredTheme.palette.textPrimary.main,
          },
        },
        variants: [
          {
            props: { className: 'navigation' },
            style: {
              padding: `0 ${coloredTheme.spacing(4)}`,
              background: coloredTheme.palette.white.main,
              '.MuiTab-root': {
                padding: coloredTheme.spacing(2),
                ...coloredTheme.typography.m,
              },
            },
          },
        ],
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
            padding: `${coloredTheme.spacing(1)} 0`,
            color: coloredTheme.palette.textHint.main,
            minHeight: 'auto',
            '& ~ .MuiTab-root': {
              marginLeft: 20,
            },
            '&[aria-selected="true"]': {
              color: coloredTheme.palette.textPrimary.main,
            },
          },
        },
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            padding: coloredTheme.spacing(3),
          },
        },
      },
      MuiFormControlLabel: {
        styleOverrides: {
          root: {
            marginLeft: 0,
            gap: coloredTheme.spacing(1),
          },
          label: {
            ...coloredTheme.typography.s,
            textOverflow: 'ellipsis',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            color: coloredTheme.palette.textTertiary.main,
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
            padding: `${coloredTheme.spacing(0.25)} ${coloredTheme.spacing(0.5)}`,
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
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: '#D7DBE1',
          },
        },
      },
      MuiPopper: {
        defaultProps: {
          slotProps: {
            paper: {
              sx: {
                borderRadius: coloredTheme.spacing(2),
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
            ...coloredTheme.typography.s,
            fontWeight: 600,
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            ...coloredTheme.typography.s,
            fontWeight: 600,
          },
        },
      },
      MuiSelect: {
        variants: [
          {
            props: { size: 'small' },
            style: {
              ...coloredTheme.typography.s,
              '& .MuiSelect-select': {
                minHeight: 'auto',
                padding: coloredTheme.spacing(1),
              },
              '& .MuiSelect-select em': {
                ...coloredTheme.typography.s,
              },
            },
          },
          {
            props: { variant: 'standard' },
            style: {
              padding: 0,
              backgroundColor: coloredTheme.palette.surfaceSecondary.main,
              borderColor: 'transparent',
              boxShadow: coloredTheme.shadows[2],
              width: '100%',
              '&::before': {
                display: 'none',
              },
              em: {
                color: coloredTheme.palette.textHint.main,
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
              ...coloredTheme.typography.s,
              backgroundColor: coloredTheme.palette.surfaceTertiary.main,
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
              ...coloredTheme.typography.s,
              fontWeight: 500,
              backgroundColor: coloredTheme.palette.surfacePrimary.main,
              border: 'solid 2px #FFFF',
            },
          },
          {
            props: { variant: 'standard' },
            style: {
              padding: 0,
              backgroundColor: coloredTheme.palette.surfaceSecondary.main,
              borderColor: 'transparent',
              boxShadow: coloredTheme.shadows[2],
              width: '100%',
              '&::before': {
                display: 'none',
              },
              em: {
                color: coloredTheme.palette.textHint.main,
                fontStyle: 'normal',
              },
            },
          },
        ],
      },
      MuiFilledInput: {
        styleOverrides: {
          root: {
            textarea: {
              ...coloredTheme.typography.s,
            },
            '&::before, &::after': {
              border: 'none',
            },
            '&:hover:not(.Mui-disabled, .Mui-error):before': {
              border: 'none',
            },
            '&.Mui-focused:after': {
              border: 'none',
            },
            background: coloredTheme.palette.surfacePrimary.main,
          },
        },
      },
      MuiStepConnector: {
        styleOverrides: {
          alternativeLabel: {
            left: 'calc(-50% + 30px)',
            right: 'calc(50% + 30px)',
          },
        },
      },
      MuiStepLabel: {
        styleOverrides: {
          iconContainer: {
            ...coloredTheme.typography.s,
            color: coloredTheme.palette.white.main,
            background: coloredTheme.palette.textPrimary.main,
            borderRadius: 30,
            fontWeight: 600,
            width: 30,
            height: 24,
            display: 'grid',
            placeItems: 'center',
            '&.Mui-disabled': {
              background: coloredTheme.palette.textHint.main,
            },
            '&.Mui-completed': {
              color: coloredTheme.palette.white.main,
              background: '#089616',
            },
          },
          label: {
            ...coloredTheme.typography.xs,
            fontWeight: 600,
            whiteSpace: 'nowrap',
            '&.Mui-completed': {
              color: '#089616',
            },
            '&.MuiStepLabel-alternativeLabel': {
              marginTop: 8,
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          input: {
            ...coloredTheme.typography.s,
            color: coloredTheme.palette.textPrimary.main,
            fontWeight: 600,
            padding: '5px 10px',
            height: '28px',
          },
        },
      },
    },
  },
  DatepickerfrFR,
  frFR
);

export { theme };

/**
 * Material theme provider embedded in a component
 */
export function PearlTheme({ children }: Readonly<PropsWithChildren<unknown>>) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
