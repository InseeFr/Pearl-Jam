import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { IconAsc } from './IconAsc';

describe('IconAsc Component', () => {
  it('renders with correct size', () => {
    const size = 25;
    render(<IconAsc size={size} />);
    const svg = screen.getByRole('img', { name: "Ascending Icon" });

    expect(svg).toHaveAttribute('width', String(size));
    expect(svg).toHaveAttribute('height', String(size));
  });
});
