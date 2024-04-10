import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PearlTheme } from './PearlTheme';
import { Row } from './Row';

describe('Row Component', () => {
  const renderWithTheme = (component) => {
    return render(<PearlTheme>{component}</PearlTheme>);
  };

  it('renders a row element with correct styles', () => {
    renderWithTheme(<Row />);
    const rowElement = screen.getByTestId('row');

    expect(rowElement).toBeInTheDocument();
    expect(rowElement).toHaveStyle('display: flex');
    expect(rowElement).toHaveStyle('flex-direction: row');
    expect(rowElement).toHaveStyle('align-items: center');
  });
});