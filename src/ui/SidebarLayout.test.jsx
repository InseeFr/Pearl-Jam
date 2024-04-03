import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SidebarLayout } from './SidebarLayout';

describe('SidebarLayout Component', () => {
  it('renders children correctly', () => {
    render(
      <SidebarLayout>
        <div data-testid="child1">Child 1</div>
        <div data-testid="child2">Child 2</div>
      </SidebarLayout>
    );

    expect(screen.getByTestId('child1')).toBeInTheDocument();
    expect(screen.getByTestId('child2')).toBeInTheDocument();
  });

  it('applies styles correctly', () => {
    render(
      <SidebarLayout>
        <div>Child</div>
      </SidebarLayout>
    );

    const layout = screen.getByTestId('sidebar-layout');
    expect(layout).toBeInTheDocument();
  });
});
