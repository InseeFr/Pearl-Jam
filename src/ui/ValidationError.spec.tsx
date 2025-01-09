import { render, screen } from '@testing-library/react';
import Box from '@mui/material/Box';
import { ValidationError } from './ValidationError';
import { ZodError, ZodIssue } from 'zod';
import { describe, it, expect } from 'vitest';

describe('ValidationError', () => {
  it('should render null if no error is provided', () => {
    render(
      <ValidationError error={null as unknown as ZodError} mt={2} data-testid="validation-box" />
    );
    const box = screen.queryByTestId('validation-box');
    expect(box).toBeNull();
  });

  it('should render null if error is not an instance of ZodError', () => {
    render(<ValidationError error={{} as ZodError} mt={2} data-testid="validation-box" />);
    const box = screen.queryByTestId('validation-box');
    expect(box).toBeNull();
  });

  it('should display error messages if ZodError is provided', () => {
    const issues: ZodIssue[] = [
      {
        code: 'invalid_type',
        path: ['field1'],
        message: 'Invalid type',
        expected: 'string',
        received: 'number',
      },
      {
        code: 'too_small',
        path: ['field2'],
        message: 'Too small',
        minimum: 5,
        type: 'number',
        inclusive: true,
      },
    ];

    const error = new ZodError(issues);

    render(<ValidationError error={error} mt={2} />);

    screen.getByText(/field1 : Invalid type/);
    screen.getByText(/field2 : Too small/);
  });
});
