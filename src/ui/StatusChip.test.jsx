import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { StatusChip } from './StatusChip';

const customTheme = createTheme({
  palette: {
    textPrimary: {
      main: '#000'
    }
  }
});

describe('StatusChip Component', () => {
  const status = {
    value: 'Active',
    color: 'green',
  };

  it('should render the chip with correct label and background color', () => {
    render(
      <ThemeProvider theme={customTheme}>
        <StatusChip status={status} />
      </ThemeProvider>
    );
    const chip = screen.getByText('Active');
    expect(chip).toBeInTheDocument();
    expect(chip.closest('div')).toHaveClass('MuiChip-root');
  });
  
  it('should have the correct text color and font weight', () => {
    render(
      <ThemeProvider theme={customTheme}>
        <StatusChip status={{ value: 'Active', color: 'primary' }} />
      </ThemeProvider>
    );
    const chip = screen.getByText('Active');
    expect(chip.closest('div')).toHaveClass('MuiChip-colorPrimary');
  });
});
