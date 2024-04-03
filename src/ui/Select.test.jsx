import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Select } from './Select';

const mockOptions = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Option 3' },
];

describe('Select Component', () => {
  it('renders with placeholder as default value', () => {
    const placeholder = 'Select an option';
    render(<Select options={mockOptions} placeholder={placeholder} allowEmpty={true} />);
    expect(screen.getByRole('combobox')).toHaveTextContent(placeholder);
  });

  it('shows options when select menu is clicked', () => {
    render(<Select options={mockOptions} placeholder="Select" allowEmpty={true} />);
    fireEvent.mouseDown(screen.getByRole('combobox'));
    mockOptions.forEach(option => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  it('displays label of selected option', () => {
    const { rerender } = render(<Select options={mockOptions} value="1" />);
    expect(screen.getByRole('combobox')).toHaveTextContent('Option 1');
    rerender(<Select options={mockOptions} value="2" />);
    expect(screen.getByRole('combobox')).toHaveTextContent('Option 2');
  });

  it('renders without any options if options prop is empty', () => {
    render(<Select options={[]} placeholder="No options" allowEmpty={true} />);
    fireEvent.mouseDown(screen.getByRole('combobox'));
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
  });
});
