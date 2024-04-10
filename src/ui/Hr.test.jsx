import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PearlTheme } from './pearlTheme';
import { Hr } from './Hr';

describe('Hr Component', () => {
  const renderWithTheme = (component) => {
    return render(<PearlTheme>{component}</PearlTheme>);
  };

  it('renders an hr element with correct styles', () => {
    renderWithTheme(<Hr />);
    const hrElement = screen.getByRole('separator');

    expect(hrElement).toBeInTheDocument();
    expect(hrElement).toHaveStyle('border: none');
    expect(hrElement).toHaveStyle('border-bottom-color: rgb(215, 219, 225)');
    expect(hrElement).toHaveStyle('border-bottom-width: 1px');
    expect(hrElement).toHaveStyle('border-bottom-style: solid');
    expect(hrElement).toHaveStyle('margin: 0');
  });
});
