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
      main: '#0a192e',
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
        background: '#666666',
        color: '#ffffff',
        '&:hover': {
          // background: '#000000',
          color: '#ffffff',
          outline: 'red solid 1px',
        },
        '&:disabled': {
          background: '#cdcdcd',
        },
      },
    },
    MuiPickersDay: {
      current: {
        color: '#000000',
        backgroundColor: '#eeeeee',
      },
      daySelected: {
        backgroundColor: '#555555',
        color: '#ffffff',
        fontWeight: 'bolder',
        '&:hover': { backgroundColor: '#aaaaaa' },
      },
    },
    MuiPickersYear: {
      yearSelected: {
        backgroundColor: '#555555',
        fontWeight: 'bolder',
      },
    },
    MuiPickersMonth: {
      monthSelected: {
        backgroundColor: '#555555',
        color: '#ffffff',
        '&:hover': { backgroundColor: '#aaaaaa' },
      },
    },
    MuiPickersToolbarButton: {
      toolbarBtn: {
        background: 'transparent',
        // border: 'transparent solid 1px',
        color: '#ffffff',
        '&:hover': {
          background: '#cdcdcd',
          color: '#000000',
          // border: '#000000 solid 1px',
        },
        '&:disabled': {
          background: '#cdcdcd',
        },
      },
    },
    MuiStepIcon: {
      root: {
        '& $text': {
          fill: 'white',
        },
        '&$active': {
          fill: 'black',
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
