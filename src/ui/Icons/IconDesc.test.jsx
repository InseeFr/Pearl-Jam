import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { IconDesc } from './IconDesc';

describe('IconDesc Component', () => {
    it('renders with correct size', () => {
        const size = 25;
        render(<IconDesc size={size} />);
        const svg = screen.getByRole('img', { name: "Descending Icon" });
        expect(svg).toHaveAttribute('width', String(size));
        expect(svg).toHaveAttribute('height', String(size));
    });
});
