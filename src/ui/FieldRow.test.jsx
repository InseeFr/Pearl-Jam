import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { controlledField } from './FieldRow';
import jest from 'jest-mock';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    green: {
      main: '#4caf50',
    },
  },
});

describe('controlledField', () => {
  it('renders a Switch component when type is "switch"', () => {
    const field = { value: true, onChange: jest.fn() };
    render(
      <ThemeProvider theme={theme}>
        {controlledField({ type: 'switch' }, field)}
      </ThemeProvider>
    );
    const switchComponent = screen.getByRole('checkbox');
    expect(switchComponent).toBeInTheDocument();
    expect(switchComponent).toBeChecked();
  });

  it('renders a DatePicker component when type is "datepicker"', () => {
    const field = { value: new Date(), onChange: jest.fn() };
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider theme={theme}>
          {controlledField({ type: 'datepicker' }, field)}
        </ThemeProvider>
      </LocalizationProvider>
    );
    const datePickerComponent = screen.getByRole('textbox');
    expect(datePickerComponent).toBeInTheDocument();
    expect(datePickerComponent).toHaveValue(field.value.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }));
  });
  
  it('renders a RadioGroup component with Stack when type is "radiostack"', () => {
    const field = { value: 'option1', onChange: jest.fn() };
    const options = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
    ];
  
    render(
      <ThemeProvider theme={theme}>
        {controlledField({ type: 'radiostack', options }, field)}
      </ThemeProvider>
    );
  
    const option1RadioButton = screen.getByRole('radio', { name: 'Option 1' });
    expect(option1RadioButton).toBeChecked();
  });
});
