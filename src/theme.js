import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  props: {
    MuiButton: {
      disableElevation: true,
      variant: 'contained',
    },
  },
  palette: {
    primary: {
      light: '#eeeeee',
      main: '#ffffff',
      dark: '#cdcdcd',
    },
    secondary: {
      light: '#0066ff',
      main: '#0a192e',
    },
    success: {
      main: '#008000',
    },
    background: {
      default: '#ffffff',
    },
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        html: {
          height: '100%',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      },
    },
    MuiInput: {
      underline: {
        '&:after,.Mui-focused&:after': {
          transform: 'scaleX(0)',
        },
      },
    },
    MuiButton: {
      root: {
        '&.MuiButton-contained': { backgroundColor: '#0a192e', color: '#ffffff' },
        '&.MuiButton-contained:hover': {
          backgroundColor: '#ffffff',
          color: '#0a192e',
          outline: '#0a192e solid 1px',
        },
        '&:disabled': {
          backgroundColor: '#cdcdcd',
        },
      },
    },
    MuiPickersDay: {
      current: {
        color: '#000000',
        backgroundColor: '#eeeeee',
      },
      daySelected: {
        backgroundColor: '#0a192e',
        color: '#ffffff',
        fontWeight: 'bolder',
        '&:hover': { backgroundColor: '#aaaaaa' },
      },
    },
    MuiPickersYear: {
      yearSelected: {
        backgroundColor: '#0a192e',
        fontWeight: 'bolder',
      },
    },
    MuiPickersMonth: {
      monthSelected: {
        backgroundColor: '#0a192e',
        color: '#ffffff',
        '&:hover': { backgroundColor: '#aaaaaa' },
      },
    },
    MuiPickersToolbarButton: {
      toolbarBtn: {
        '&:hover': {
          background: '#cdcdcd',
          color: '#000000',
        },
      },
    },
    MuiStepIcon: {
      root: {
        '& $text': {
          fill: 'white',
        },
        '&$active': {
          fill: '#0a192e',
        },
        '&$completed': {
          color: 'green',
        },
      },
    },
    MuiStepLabel: {
      alternativeLabel: {
        marginTop: 'auto',
      },
      labelContainer: {
        '& $alternativeLabel': {
          marginTop: '0.5em',
        },
      },
    },
  },
});
export default theme;
