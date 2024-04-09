import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { AbsoluteLink } from './AbsoluteLink';

describe('AbsoluteLink Component', () => {
  it('should render children when "to" prop is not provided', () => {
    render(
      <AbsoluteLink>
        <div data-testid="child">Test Child</div>
      </AbsoluteLink>
    );
    const childDiv = screen.getByTestId('child');
    expect(childDiv).toBeInTheDocument();
    expect(childDiv).toHaveTextContent('Test Child');
  });

  it('should render a Link component with correct props when "to" prop is provided', () => {
    render(
      <MemoryRouter>
        <AbsoluteLink to="/path">
          <div>Test Content</div>
        </AbsoluteLink>
      </MemoryRouter>
    );
    const link = screen.getByText('Test Content').closest('a');
    expect(link).toHaveAttribute('href', '/path');
    expect(link).toHaveStyle('text-decoration: none');
  });
});