import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#eeeeee',
      main: '#ffffff',
      dark: '#cdcdcd',
      darker: '#666666',
      contrastText: '#000000',
    },
    secondary: {
      light: '#0066ff',
      main: '#0f417a',
      contrastText: '#ffcc00',
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
        border: 'transparent solid 1px',
        color: '#ffffff',
        '&:hover': {
          background: '#cdcdcd',
          color: '#000000',
          border: 'black solid 1px',
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
        border: 'transparent solid 1px',
        color: '#ffffff',
        '&:hover': {
          background: '#cdcdcd',
          color: '#000000',
          border: 'black solid 1px',
        },
        '&:disabled': {
          background: '#cdcdcd',
        },
      },
    },
  },
});
export default theme;
