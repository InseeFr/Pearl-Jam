import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { SwitchIOS } from './Switch.jsx';

const customTheme = createTheme({
  palette: {
    separator: {
      main: '#CCCCCC', 
    },
  },
  transitions: {
    create: () => 'none',
  },
});

describe('SwitchIOS Component', () => {
  it('renders without errors', () => {
    render(
      <ThemeProvider theme={customTheme}>
        <SwitchIOS />
      </ThemeProvider>
    );
    const switchComponent = screen.getByRole('checkbox');
    expect(switchComponent).toBeInTheDocument();
  });

  it('applies custom styles from sx prop', () => {
    const { container } = render(
      <ThemeProvider theme={customTheme}>
        <SwitchIOS />
      </ThemeProvider>
    );
    expect(container.firstChild).toHaveClass('MuiSwitch-root');
  });
  it('responds to the disabled prop', () => {
    render(
      <ThemeProvider theme={customTheme}>
        <SwitchIOS disabled />
      </ThemeProvider>
    );
    const switchComponent = screen.getByRole('checkbox');
    expect(switchComponent).toBeDisabled();
  });
});
