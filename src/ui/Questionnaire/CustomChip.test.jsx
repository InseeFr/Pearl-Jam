import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomChip from './CustomChip';

describe('CustomChip Component', () => {
  it('renders the chip with the correct label', () => {
    const label = 'Test Label';
    render(<CustomChip label={label} />);
    const chip = screen.getByText(label);
    expect(chip).toBeInTheDocument();
  });

  it('renders the chip with the correct icon', () => {
    const icon = <i className="fa fa-star" />;
    render(<CustomChip icon={icon} />);
    const chipIcon = screen.getByTestId('custom-chip').querySelector('i.fa.fa-star');
    expect(chipIcon).toBeInTheDocument();
});


it('renders the chip with the correct color', () => {
  const color = 'red';
  render(<CustomChip color={color} />);
  const chip = screen.getByTestId('custom-chip');
  expect(chip).toHaveStyle(`color: rgb(255, 0, 0)`);
});


  it('renders the chip with shadow when shadow prop is true', () => {
    render(<CustomChip shadow={true} />);
    const chip = screen.getByTestId('custom-chip');
    expect(chip).toHaveStyle('box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.2)');
  });

  it('renders the chip without shadow when shadow prop is false', () => {
    render(<CustomChip shadow={false} />);
    const chip = screen.getByTestId('custom-chip');
    expect(chip).toHaveStyle('box-shadow: none');
  });
});