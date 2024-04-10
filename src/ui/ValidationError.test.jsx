import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '@mui/material/styles';
import { PearlTheme } from './pearlTheme';
import { ValidationError } from './ValidationError';
import { ZodError } from 'zod';

const createMockZodError = (message, path = ['field']) => new ZodError([
  { message, path, code: 'custom-error' }
]);

describe('ValidationError Component', () => {
  it('does not render anything if the error is not a ZodError instance', () => {
    const nonZodError = { message: 'Error', path: ['field'] };
    render(
      <ThemeProvider theme={PearlTheme}>
        <ValidationError error={nonZodError} />
      </ThemeProvider>
    );
    const messageBox = screen.queryByText(/:/);
    expect(messageBox).not.toBeInTheDocument();
  });

  it('applies additional props to the Box component', () => {
    const mockError = createMockZodError('Required field', ['password']);
    render(
      <ThemeProvider theme={PearlTheme}>
        <ValidationError error={mockError} data-testid="validation-error" />
      </ThemeProvider>
    );
    const validationBox = screen.getByTestId('validation-error');
    expect(validationBox).toHaveStyle('font-weight: 500');
  });

  it('displays multiple errors correctly', () => {
    const combinedError = new ZodError([
      { message: 'Invalid email', path: ['email'], code: 'invalid_email' },
      { message: 'Password too short', path: ['password'], code: 'short_password' }
    ]);
    render(
      <ThemeProvider theme={PearlTheme}>
        <ValidationError error={combinedError} />
      </ThemeProvider>
    );
    const emailError = screen.getByText('email : Invalid email');
    const passwordError = screen.getByText('password : Password too short');
    expect(emailError).toBeInTheDocument();
    expect(passwordError).toBeInTheDocument();
  });
});
