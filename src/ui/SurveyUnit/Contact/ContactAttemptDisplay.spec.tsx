import { fireEvent, render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { ContactAttemptDisplay, ContactAttemptDisplayProps } from './ContactAttemptDisplay';

beforeAll(() => {
  // Force locale to en-US
  const OriginalDateTimeFormat = Intl.DateTimeFormat;

  vi.spyOn(Intl, 'DateTimeFormat').mockImplementation((locale, options) => {
    return new OriginalDateTimeFormat('en-US', options); // Use the original constructor
  });
});

describe('ContactAttemptDisplay', () => {
  const mockOnDelete = vi.fn();

  const defaultProps = {
    attempt: {
      status: 'INA',
      medium: 'TEL',
      date: '2023-01-01T12:00:00Z',
    },
    onDelete: mockOnDelete,
  } as unknown as ContactAttemptDisplayProps;

  it('should render the contact attempt details correctly', () => {
    render(<ContactAttemptDisplay {...defaultProps} />);

    screen.getByText('Interview accepted');
    screen.getByText('- Phone');
    screen.getByText('Sunday, January 1, 2023', { exact: false });
  });

  it('should call onDelete when delete button is clicked', () => {
    render(<ContactAttemptDisplay {...defaultProps} />);

    const deleteButton = screen.getByRole('button');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(defaultProps.attempt);
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });
});
